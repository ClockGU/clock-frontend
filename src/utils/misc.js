import i18n from "@/plugins/i18n.js";
import {
  mdiBriefcaseClockOutline,
  mdiMedicalBag,
  mdiSurfing,
  mdiWhiteBalanceSunny
} from "@mdi/js";

const { t } = i18n.global;

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
