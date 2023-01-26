const defaultLength = 5;

export const createUUID = (length?: number): string => {
  return crypto
    .randomUUID()
    .replaceAll('-', '')
    .substring(0, length || defaultLength);
};
