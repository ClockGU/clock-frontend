const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const groupByContract = groupBy("contract");

const indexOfBy = (key) => ({
  element,
  array,
  start = 0,
  end = array.length
}) => {
  start = start || 0;
  end = end || array.length;
  const pivot = parseInt(start + (end - start) / 2, 10);
  if (array[pivot][key] === element[key]) return pivot;
  if (end - start <= 1) {
    return array[pivot][key] > element[key] ? pivot - 1 : pivot;
  }
  if (array[pivot][key] < element[key]) {
    return indexOfBy(key)({ element, array, start: pivot, end });
  }
  return indexOfBy(key)({ element, array, start, end: pivot });
};

export const indexOfByStarted = indexOfBy("started");
export const indexOfByStartDate = indexOfBy("startDate");
export const indexOfByMonthYear = indexOfBy("monthYear");

export function sortObjects(objects, key) {
  return objects.sort((a, b) => b[key] - a[key]);
}

export function getContractWithLastActivity({ shifts, contracts }) {
  if (shifts.length === 0) {
    if (contracts.length === 0) return "";
    return sortObjects(contracts, "modified_at")[0].uuid;
  } else if (shifts.length === 1) {
    return shifts[0].contract;
  } else {
    return sortObjects(shifts, "modified_at")[0].contract;
  }
}

export function getNextContractParams(to, uuid) {
  return { ...to, params: { ...to.params, contract: uuid } };
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
