export const getCacheBustedUrl = (url: string) => {
  return `${url}?v=${new Date().getTime()}`;
};