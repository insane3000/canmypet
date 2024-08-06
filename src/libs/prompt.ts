export const prompt = (imageAnalyzed: string, pet: string) => {
  return `
  Si la siguiente frase es la descripción de un alimento o alimentos
  ${imageAnalyzed}
  dime si el animal ${pet} puede consumir dichos alimentos
  asegurate de responde en español
  `;
};
