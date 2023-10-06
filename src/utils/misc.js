import i18n from "@/plugins/i18n.js";
import {
  mdiBriefcaseClockOutline,
  mdiMedicalBag,
  mdiSurfing,
  mdiWhiteBalanceSunny
} from "@mdi/js";

const { t } = i18n.global;

export const SHIFT_TABLE_HEADERS = [
  {
    text: t("time.date"),
    align: "start",
    sortable: true,
    key: "date"
  },
  {
    text: t("time.start"),
    align: "start",
    sortable: true,
    key: "start"
  },
  {
    text: t("time.duration"),
    align: "start",
    sortable: true,
    key: "duration"
  },
  {
    text: t("calendar.type"),
    align: "start",
    sortable: true,
    key: "type"
  },
  {
    text: t("time.reviewed"),
    align: "start",
    sortable: true,
    key: "reviewed"
  },
  {
    text: "Tags",
    align: "start",
    sortable: true,
    key: "tags"
  },
  {
    text: "Notes",
    align: "start",
    sortable: true,
    key: "note"
  },
  {
    align: "start",
    sortable: false,
    key: "actions"
  }
];

export const MESSAGE_TYPE_TAGS = {
  CL: t("news.label.changelog"),
  NO: t("news.label.notice"),
  UD: t("news.label.update"),
  WN: t("news.label.warning"),
  TP: t("news.label.tip")
};

export const SHIFT_TYPE_ICONS = {
  st: mdiBriefcaseClockOutline,
  sk: mdiMedicalBag,
  vn: mdiSurfing,
  bh: mdiWhiteBalanceSunny
};
