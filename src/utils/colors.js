import colors from "vuetify/util/colors";
export const SHIFT_TYPE_COLORS = {
  st: "primary",
  sk: "pink lighten-1",
  vn: "green lighten-1",
  bh: "orange"
};
export const HEX_SHIFT_TYPE_COLORS = {
  st: colors.blue.darken2,
  sk: colors.pink.lighten1,
  vn: colors.green.lighten1,
  bh: colors.orange
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
