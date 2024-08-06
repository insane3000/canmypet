export const prompt = (imageAnalyzed: string, pet: string) => {
  return `
  si la siguiente frase es la descripcion de un alimento o alimentos
  ${imageAnalyzed}
  dime si un ${pet} puede consumir dichos alimentos
  asegurate de responde en español
  `;
};
