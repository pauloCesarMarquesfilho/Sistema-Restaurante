/**
 * Utilitário para formatação de datas no projeto
 */

/**
 * Converte um número de mês (0-11) para nome do mês em espanhol
 * @param month - Número do mês (0-11)
 * @returns String com nome do mês em espanhol
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  if (month >= 0 && month < 12) {
    return months[month];
  }
  
  return 'Ningun mes se encontro';
}

/**
 * Formata a hora atual no formato HH:MM
 * @param date - Data a ser formatada (opcional, se não fornecida usa a data atual)
 * @returns String no formato "HH:MM"
 */
export function formatHour(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

/**
 * Formata uma data no formato "El DD de MES del YYYY"
 * @param date - Data a ser formatada (opcional, se não fornecida usa a data atual)
 * @returns String no formato "El DD de MES del YYYY"
 */
export function formatFullDate(date: Date = new Date()): string {
  const day = date.getDate();
  const month = getMonthName(date.getMonth());
  const year = date.getFullYear();
  
  return `El ${day} de ${month} del ${year}`;
}

/**
 * Obtém informações de formatação para data e hora atuais
 * @param date - Data a ser formatada (opcional, se não fornecida usa a data atual)
 * @returns Objeto com valores formatados para hora e data completa
 */
export function getFormattedDateTime(date: Date = new Date()): { 
  resultadoHora: string;
  resultadoFecha: string;
} {
  return {
    resultadoHora: formatHour(date),
    resultadoFecha: formatFullDate(date)
  };
} 