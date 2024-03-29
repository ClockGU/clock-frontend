import store from "@/store";

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
  if (array.length === 0) return 0;
  start = start || 0;
  end = end || array.length;
  const pivot = parseInt(start + (end - start) / 2, 10);
  if (array[pivot][key] === element[key]) return pivot;
  if (end - start <= 1) {
    return array[pivot][key] > element[key] ? pivot : pivot + 1;
  }
  if (array[pivot][key] < element[key]) {
    return indexOfBy(key)({ element, array, start: pivot, end });
  }
  return indexOfBy(key)({ element, array, start, end: pivot });
};

export const indexOfByStarted = indexOfBy("started");
export const indexOfByStartDate = indexOfBy("startDate");
export const indexOfByMonthYear = indexOfBy("monthYear");

const sortBy = (key) => (objects) => {
  return objects.sort((a, b) => a[key] - b[key]);
};

export const sortByStarted = sortBy("started");
export const sortByStartDate = sortBy("startDate");
export const sortByMonthYear = sortBy("monthYear");
export const sortByModifiedAt = sortBy("modifiedAt");
export const sortByPrioritization = sortBy("prioritization");

export function getContractWithLastActivity({ shifts, contracts }) {
  if (shifts.length === 0) {
    if (contracts.length === 0) return undefined;
    return sortByModifiedAt(contracts)[0];
  } else if (shifts.length === 1) {
    return store.getters["contentData/contractById"](shifts[0].contract);
  } else {
    return store.getters["contentData/contractById"](
      sortByModifiedAt(shifts).at(-1).contract
    );
  }
}

export function getNextContractParams(to, uuid) {
  return { ...to, params: { ...to.params, contract: uuid } };
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
