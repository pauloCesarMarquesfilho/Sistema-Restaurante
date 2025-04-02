import { Response } from 'express';
import { Collection } from 'monk';

/**
 * Utilitários para operações de banco de dados
 */

/**
 * Verificar se uma coleção existe e está disponível
 * @param collection - Coleção do banco de dados
 * @param res - Objeto Response do Express para responder em caso de erro
 * @returns true se a coleção é válida, false se não for
 */
export function validateCollection(collection: Collection | undefined, res: Response): boolean {
  if (!collection) {
    res.status(500).json({ error: 'Database collection not available' });
    return false;
  }
  return true;
}

/**
 * Envolver operação de banco de dados com tratamento de erro
 * @param action - Função a ser executada
 * @param res - Objeto Response do Express para responder em caso de erro
 * @param errorMessage - Mensagem de erro personalizada
 */
export function safeDbOperation<T>(
  action: () => T, 
  res: Response, 
  errorMessage: string = 'Database error'
): T | void {
  try {
    return action();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: errorMessage });
    return;
  }
}

/**
 * Promisificar uma operação de insert do Monk
 * @param collection - Coleção do banco de dados
 * @param document - Documento a ser inserido
 * @returns Promise que resolve com o documento inserido ou rejeita com erro
 */
export function insertDocument(collection: Collection, document: any): Promise<any> {
  return new Promise((resolve, reject) => {
    collection.insert(document)
      .success((doc: any) => resolve(doc))
      .error((err: Error) => reject(err));
  });
}

/**
 * Promisificar uma operação de update do Monk
 * @param collection - Coleção do banco de dados
 * @param query - Query para selecionar documentos
 * @param update - Atualização a ser aplicada
 * @returns Promise que resolve com o resultado da atualização ou rejeita com erro
 */
export function updateDocument(collection: Collection, query: any, update: any): Promise<any> {
  return new Promise((resolve, reject) => {
    collection.update(query, update)
      .success((doc: any) => resolve(doc))
      .error((err: Error) => reject(err));
  });
} 