export const SHIFT_TYPE_COLORS = {
  st: "primary",
  sk: "grey",
  vn: "green lighten-1",
  bh: "orange"
};

export const MESSAGE_TYPE_COLORS = {
  CL: "warning",
  NO: "grey-lighten-1",
  UD: "green lighten-1",
  WN: "error",
  TP: "primary lighten-2"
};

export function mdShortToClassString(mdName) {
  const splitValues = mdName.split(" ");
  let classString = splitValues[0] + "--text ";
  if (splitValues.length !== 0) {
    classString += " " + "text--" + splitValues[1];
  }
  return classString;
}
