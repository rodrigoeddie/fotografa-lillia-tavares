import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { ClienteService } from '~/server/services/ClienteService';
import { LgpdService } from '~/server/services/LgpdService';
import { purgeCache } from '~/server/utils/purge-cache';
import { encryptField } from '~/server/utils/encrypt-field';
import { hashPassword } from '~/server/utils/password';
import { deleteCfImages } from '~/server/utils/delete-cf-images';
import { deleteR2Object } from '~/server/utils/r2-presign';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new ClienteService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const cliente = await svc.getById(id);
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });
    const { senha_hash: _, ...safe } = cliente;
    return safe;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { nome, email, senha, celular, bg_image } = body ?? {};
    if (!nome || !email) throw createError({ statusCode: 400, statusMessage: 'nome e email são obrigatórios' });

    const cliente = await svc.getById(id);
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });

    await svc.update(id, nome, email, bg_image ?? null, celular ?? null);

    if (senha) {
      const { hash, salt } = await hashPassword(senha);
      const senhaHash = `pbkdf2$${salt}$${hash}`;
      const fieldKey = process.env.FIELD_ENCRYPT_KEY;
      const senhaAcesso = fieldKey ? await encryptField(senha, fieldKey) : null;
      await svc.updateSenha(id, senhaHash, senhaAcesso ?? undefined);
    }

    await purgeCache(event, ['/api/cliente/sessoes']);
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    /* Direito ao esquecimento (LGPD): apaga o cliente e toda a cadeia de dados —
       D1 (sessões, seleções, entregas, pagamentos, notificações) + fotos no
       Cloudflare Images + ZIPs no R2. Irreversível. */
    const wiped = await new LgpdService(getOrm(event)).wipeCliente(id);
    if (!wiped) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });

    await deleteCfImages(event, wiped.cfImageIds);

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    if (accountId && accessKeyId && secretAccessKey && bucketName) {
      await Promise.all(
        wiped.r2Keys.map((key) =>
          deleteR2Object({ accountId, accessKeyId, secretAccessKey, bucketName, key }).catch(() => {}),
        ),
      );
    } else if (wiped.r2Keys.length) {
      console.error(`[lgpd] R2 não configurado — ${wiped.r2Keys.length} objeto(s) órfão(s):`, wiped.r2Keys);
    }

    return { success: true, sessoes_removidas: wiped.sessaoCount, imagens_removidas: wiped.cfImageIds.length, arquivos_r2_removidos: wiped.r2Keys.length };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
