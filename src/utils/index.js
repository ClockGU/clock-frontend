import store from "@/store";

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const groupByContract = groupBy("contract");

const indexOfBy =
  (key) =>
  ({ element, array, start = 0, end = array.length }) => {
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

const sortAscBy = (key) => (objects) => {
  return objects.sort((a, b) => a[key] - b[key]);
};

const sortDescBy = (key) => (objects) => {
  return objects.sort((a, b) => b[key] - a[key]);
};

export const sortAscByStarted = sortAscBy("started");
export const sortAscByStartDate = sortAscBy("startDate");
export const sortDescByLastActivity = sortDescBy("lastActivity");
export const sortAscByMonthYear = sortAscBy("monthYear");
export const sortAscByPrioritization = sortAscBy("prioritization");

export function getContractWithLastActivity({ shifts, contracts }) {
  if (!contracts || contracts.length === 0) return undefined;

  const now = new Date();

  // Split contracts by validity
  const validContracts = contracts.filter(c =>
    new Date(c.startDate) <= now &&
    (!c.endDate || new Date(c.endDate) >= now)
  );

  const expiredContracts = contracts.filter(
    c => !validContracts.includes(c)
  );

  // get contract by most recent shift activity
  const contractFromLatestShift = (candidateContracts) => {
    const candidateIds = new Set(candidateContracts.map(c => c.id));

    const relevantShifts = shifts.filter(s =>
      candidateIds.has(s.contract)
    );

    if (relevantShifts.length === 0) return undefined;

    const latestShift = relevantShifts.reduce(
      (max, s) => (max.modifiedAt > s.modifiedAt ? max : s),
      relevantShifts[0]
    );

    return store.getters["contentData/contractById"](latestShift.contract);
  };

  // get most recently modified contract
  const mostRecentlyModifiedContract = (list) =>
    list.reduce(
      (max, c) => (max.modifiedAt > c.modifiedAt ? max : c),
      list[0]
    );

  // priority to valid contracts
  if (validContracts.length > 0) {
    const validContractFromLatestShift = contractFromLatestShift(validContracts);
    if (validContractFromLatestShift) return validContractFromLatestShift;
    // fallback to most recently modified valid contract
    return mostRecentlyModifiedContract(validContracts);
  }

  // in case of no valid contracts, try expired ones
  if (shifts.length > 0) {
    const expiredContractFromLatestShift = contractFromLatestShift(expiredContracts);
    if (expiredContractFromLatestShift) return expiredContractFromLatestShift;
  }
  // fallback to most recently modified expired contract
  return mostRecentlyModifiedContract(expiredContracts);
}

export function getNextContractParams(to, uuid) {
  return { ...to, params: { ...to.params, contract: uuid } };
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
