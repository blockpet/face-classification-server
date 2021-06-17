const getRankArray = (arr, limit) => {
  const resultArr = arr.map((value, index) => {
    return { mlKey: index, accuracy: value };
  });
  resultArr.sort((a, b) => {
    return b.accuracy - a.accuracy;
  });
  return resultArr.slice(0, limit);
};

export { getRankArray };
