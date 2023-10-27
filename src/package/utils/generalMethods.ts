const defaultLength = 5; // length of uuid string

const createUUID = (length?: number): string => {
  return '_' + (Math.random() + 1).toString(36).substring((length || defaultLength) - 1);
};

export { createUUID };
