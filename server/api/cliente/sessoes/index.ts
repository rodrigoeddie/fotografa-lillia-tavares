import { defineEventHandler } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { ProdutoService } from '~/server/services/ProdutoService';
import { ClienteService } from '~/server/services/ClienteService';
import { SessaoService } from '~/server/services/SessaoService';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const orm = getOrm(event);

  const [cliente, sessoes, todosProdutosComPacotes] = await Promise.all([
    new ClienteService(orm).getById(clienteId),
    new SessaoService(orm).listByCliente(clienteId),
    new ProdutoService(orm).listComPacotes(),
  ]);

  // Build a map: produto title → ordered pacotes
  const pacotesMap = new Map<string, string[]>();
  for (const p of todosProdutosComPacotes) {
    pacotesMap.set(p.title, p.pacotes.map((pc) => pc.title));
  }

  const sessoesComTitulo = sessoes.map((s) => ({
    ...s,
    pacote_titulo: pacotesMap.get(s.produto_tipo)?.[s.pacote_index] ?? null,
  }));

  return {
    cliente: cliente ? { id: cliente.id, nome: cliente.nome, email: cliente.email, bg_image: cliente.bg_image ?? null } : null,
    sessoes: sessoesComTitulo,
  };
});
