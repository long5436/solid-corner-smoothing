const createRandomId = () => {
  return '_' + Math.random().toString(36).substring(3, 9);
};

export { createRandomId };
