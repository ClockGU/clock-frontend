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
    title: t("time.date"),
    align: "start",
    sortable: true,
    key: "date"
  },
  {
    title: t("time.start"),
    align: "start",
    sortable: true,
    key: "start"
  },
  {
    title: t("time.duration"),
    align: "start",
    sortable: true,
    key: "duration"
  },
  {
    title: t("calendar.type"),
    align: "start",
    sortable: true,
    key: "type"
  },
  {
    title: t("time.reviewed"),
    align: "start",
    sortable: true,
    key: "reviewed"
  },
  {
    title: "Tags",
    align: "start",
    sortable: true,
    key: "tags"
  },
  {
    title: "Notes",
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
