export function sortObjects(objects, key) {
  return objects.sort((a, b) => b[key] - a[key]);
}

export function getContractWithLastActivity({ shifts, contracts }) {
  if (shifts.length === 0) {
    if (contracts.length < 2) return contracts[0].uuid;

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
