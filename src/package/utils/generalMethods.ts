const defaultLength = 5; // length of uuid string

const createUUID = (length?: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let className = '';

  for (let i = 0; i < (length || defaultLength); i++) {
    className += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return className;
};

export { createUUID };
