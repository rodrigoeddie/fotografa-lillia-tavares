import { defineEventHandler } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getDB, dbGetClienteById, dbListSessoesByCliente } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);

  const cliente = await dbGetClienteById(db, clienteId);
  const { results: sessoes } = await dbListSessoesByCliente(db, clienteId);

  return {
    cliente: cliente ? { id: cliente.id, nome: cliente.nome, email: cliente.email } : null,
    sessoes,
  };
});
