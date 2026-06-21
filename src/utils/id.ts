let idCounter = 1000;

export const genId = (): string => {
  idCounter += 1;
  return `id_${idCounter}_${Math.random().toString(36).slice(2, 6)}`;
};
