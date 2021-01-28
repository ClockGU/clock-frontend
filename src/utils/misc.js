import i18n from "@/plugins/i18n";

export const SHIFT_TABLE_HEADERS = [
  {
    text: i18n.t("time.date"),
    align: "start",
    sortable: true,
    value: "date"
  },
  {
    text: i18n.t("time.start"),
    align: "start",
    sortable: true,
    value: "start"
  },
  {
    text: i18n.t("time.end"),
    align: "start",
    sortable: true,
    value: "end"
  },
  {
    text: i18n.t("time.duration"),
    align: "start",
    sortable: true,
    value: "duration"
  },
  {
    text: i18n.t("calendar.type"),
    align: "start",
    sortable: false,
    value: "type"
  },
  {
    text: i18n.t("time.reviewed"),
    align: "start",
    sortable: true,
    value: "reviewed"
  },
  { text: i18n.t("actions.actions"), 
    value: "actions",
    align: "center",
    sortable: false }
];
