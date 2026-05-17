export const toDisplayImagePath = (path: string) =>
  path.replace(/^\/images\//, '/images-display/');

export const toThumbImagePath = (path: string) =>
  path.replace(/^\/images\//, '/images-thumb/');
