import { defineEventHandler } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getDB, dbGetClienteById, dbListSessoesByCliente, dbListProdutos, dbListPacotesByProduto } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);

  const [cliente, { results: sessoes }, { results: todosProdutos }] = await Promise.all([
    dbGetClienteById(db, clienteId),
    dbListSessoesByCliente(db, clienteId),
    dbListProdutos(db),
  ]);

  // Build a map: produto title → ordered pacotes
  const pacotesMap = new Map<string, string[]>();
  await Promise.all(
    todosProdutos.map(async (p) => {
      const { results: pacotes } = await dbListPacotesByProduto(db, p.id);
      pacotesMap.set(p.title, pacotes.map((pc) => pc.title));
    }),
  );

  const sessoesComTitulo = sessoes.map((s) => ({
    ...s,
    pacote_titulo: pacotesMap.get(s.produto_tipo)?.[s.pacote_index] ?? null,
  }));

  return {
    cliente: cliente ? { id: cliente.id, nome: cliente.nome, email: cliente.email, bg_image: cliente.bg_image ?? null } : null,
    sessoes: sessoesComTitulo,
  };
});
