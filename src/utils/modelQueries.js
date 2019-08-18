import { Contract } from "@/models/Contracts";
import { Shift } from "@/models/Shifts";

export function mapContracts(data) {
  const contract = new Contract({
    uuid: data.id,
    name: data.name,
    date: { start: data.start_date, end: data.end_date },
    hours: data.hours
  });

  return contract;
}

export function mapShifts(data) {
  const types = {
    st: { text: "Shift", value: "st" },
    sk: { text: "Sick", value: "sk" },
    vn: { text: "Vacation", value: "vn" }
  };

  const shift = new Shift({
    uuid: data.id,
    name: data.name,
    date: { start: data.started, end: data.stopped },
    contract: data.contract,
    type: types[data.type],
    note: data.note,
    tags: data.tags
  });

  return shift;
}

export function mapItemsAndListsToModel(data, fn) {
  let output;

  if (!Array.isArray(data)) {
    // Handle single item
    output = fn(data);
  } else {
    // Handle list of items
    output = data.map(item => fn(item));
  }

  return output;
}
