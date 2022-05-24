import i18n from "@/plugins/i18n";

import {
  mdiBriefcaseClockOutline,
  mdiMedicalBag,
  mdiSurfing,
  mdiWhiteBalanceSunny
} from "@mdi/js";

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
    text: i18n.t("time.duration"),
    align: "start",
    sortable: true,
    value: "duration"
  },
  {
    text: i18n.t("calendar.type"),
    align: "start",
    sortable: true,
    value: "type"
  },
  {
    text: i18n.t("time.reviewed"),
    align: "start",
    sortable: true,
    value: "reviewed"
  },
  {
    text: "Tags",
    align: "start",
    sortable: true,
    value: "tags"
  },
  {
    text: "Notes",
    align: "start",
    sortable: true,
    value: "note"
  },
  {
    align: "start",
    sortable: false,
    value: "actions"
  }
];

export const MESSAGE_TYPE_TAGS = {
  CL: i18n.t("news.label.changelog"),
  NO: i18n.t("news.label.notice"),
  UD: i18n.t("news.label.update"),
  WN: i18n.t("news.label.warning"),
  TP: i18n.t("news.label.tip")
};

export const SHIFT_TYPE_ICONS = {
  st: mdiBriefcaseClockOutline,
  sk: mdiMedicalBag,
  vn: mdiSurfing,
  bh: mdiWhiteBalanceSunny
};
