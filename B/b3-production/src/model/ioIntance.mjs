// ioInstance.mjs

let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const getIoInstance = () => {
  return ioInstance;
};
