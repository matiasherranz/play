
export const safeArrayToString = (arr, sliceLength, joinStr=', ') => {
  if (!arr) {
    return '';
  }

  let joined = arr.join(joinStr);
  if (sliceLength) {
    joined = `${joined.slice(0, sliceLength)}...`
  }

  return joined;
};
