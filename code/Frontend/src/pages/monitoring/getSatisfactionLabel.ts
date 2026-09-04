export const getSatisfactionLabel = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "Не обработано";
  if (value === 0) return "Неудовлетворён";
  if (value === 1) return "Частично удовлетворён";
  if (value === 2) return "Полностью удовлетворён";
  return "Не обработано";
};