export const emotionLabelsRu: Record<string, string> = {
  Angry: "Злой",
  Disgust: "Отвращение",
  Fear: "Испуганный",
  Happy: "Счастливый",
  Neutral: "Нейтральный",
  Sad: "Грустный",
  Surprise: "Удивлённый",
};

export const booleanLabelRu = (value: boolean | null | undefined): string =>
  value ? "Да" : "Нет";

export const statusLabelRu = (value: string | boolean | null | undefined): string => {
  if (typeof value === "boolean") return booleanLabelRu(value);
  if (value === null || value === undefined || value === "") return "Не указано";

  const normalized = value.toString().trim().toLowerCase();

  const labels: Record<string, string> = {
    active: "Активен",
    inactive: "Неактивен",
    true: "Да",
    false: "Нет",
    success: "Успешно",
    succeeded: "Успешно",
    done: "Готово",
    completed: "Завершено",
    failed: "Ошибка",
    error: "Ошибка",
    pending: "Ожидает",
    processing: "Обрабатывается",
    loading: "Загрузка",
    running: "Запущено",
    stopped: "Остановлено",
    started: "Запущено",
    ready: "Готово",
  };

  return labels[normalized] ?? value;
};
