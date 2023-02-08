const objectToQueryString = (obj, delimiter = '+') => {
  return Object.keys(obj)
    .map((key) => `${key}:${obj[key]}`)
    .join(delimiter)
}

export default objectToQueryString
