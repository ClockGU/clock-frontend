import { ref, computed, watch } from "vue";
import { dateIsHoliday } from "@/utils/date";
import isSameDay from "date-fns/isSameDay";
import { isSameMonth } from "date-fns";
import store from "@/store";
import VueI18n from "@/plugins/i18n";

export function useShiftValidation(shift, isLive = false) {
  const errorMessages = ref([]);
  const alertMessages = ref([]);

  const t = (key) => VueI18n.global.t(key);
  const isShiftValid = () => Boolean(shift);

  const validateStartedBeforeStopped = () => {
    if (isLive) {
      return null;
    }
    return shift.started > shift.stopped
      ? t("shifts.errors.startedBeforeStopped")
      : null;
  };

  const validateMaxWorktimePerDay = () => {
    let newShiftWorktime = (shift.stopped - shift.started) / 60000;
    const totalWorktime = newShiftWorktime + alreadyClockedWorktime();

    if (
      totalWorktime > 6 * 60 &&
      totalWorktime <= 9 * 60 &&
      totalBreaktime() < 30
    ) {
      newShiftWorktime -= 30 - totalBreaktime();
    } else if (totalWorktime > 9 * 60 && totalBreaktime() < 45) {
      newShiftWorktime -= 45 - totalBreaktime();
    }

    return newShiftWorktime + alreadyClockedWorktime() > 10 * 60
      ? t("shifts.errors.maximumWorktimePerDay")
      : null;
  };

  const checkAutomaticWorktimeCutting = () => {
    const newShiftWorktime = (shift.stopped - shift.started) / 60000;
    const totalWorktime = newShiftWorktime + alreadyClockedWorktime();

    if (
      (totalWorktime > 9 * 60 && totalBreaktime() < 45) ||
      (totalWorktime <= 9 * 60 &&
        totalWorktime > 6 * 60 &&
        totalBreaktime() < 30)
    ) {
      return t("shifts.errors.autoWorktimeCutting");
    }
    return null;
  };

  const validateOnlyHolidayOnHolidays = () => {
    return dateIsHoliday(shift.started) && shift.type !== "bh"
      ? t("shifts.errors.workingOnHolidays")
      : null;
  };

  const validateHolidayOnWorkdays = () => {
    return shift.type === "bh" && !dateIsHoliday(shift.started)
      ? t("shifts.errors.holidayOnWorkday")
      : null;
  };

  const validateNoSunday = () => {
    return shift.started.getDay() === 0
      ? t("shifts.errors.workingOnSundays")
      : null;
  };

  const validateExclusivityVacation = () => {
    const shifts = shiftsThisDay();
    if (
      (shift.type === "vn" && shifts.some((s) => s.type !== "vn")) ||
      (shift.type === "st" && shifts.some((s) => s.type === "vn"))
    ) {
      return t("shifts.errors.exclusiveVacation");
    }
    return null;
  };

  const validateExclusivitySick = () => {
    const shifts = shiftsThisDay();
    if (
      (shift.type === "sk" && shifts.some((s) => s.type !== "sk")) ||
      (shift.type === "st" && shifts.some((s) => s.type === "sk"))
    ) {
      return t("shifts.errors.exclusiveSick");
    }
    return null;
  };

  const validateOverlapping = () => {
    for (let s of shiftsThisDay()) {
      if (s.started <= shift.started && shift.started < s.stopped) {
        return t("shifts.errors.overlappingStarted");
      }
      if (s.started < shift.stopped && shift.stopped <= s.stopped) {
        return t("shifts.errors.overlappingStopped");
      }
    }
    return null;
  };

  const validateInLockedMonth = () => {
    return shiftsThisMonth().some((s) => s.locked)
      ? t("shifts.errors.month_already_locked")
      : null;
  };

  const checkEightTwentyRule = () => {
    if (!isStudEmp()) {
      return null;
    }
    return shift.started.getHours() < 8 || shift.stopped.getHours() > 20
      ? t("shifts.errors.eightTwentyRule")
      : null;
  };

  const shiftsThisDay = () => {
    return store.getters["contentData/allShifts"].filter(
      (s) =>
        isSameDay(s.started, shift.started) &&
        s.wasReviewed &&
        s.id !== shift.id
    );
  };

  const shiftsThisMonth = () => {
    return store.getters["contentData/selectedShifts"].filter(
      (s) =>
        isSameMonth(s.started, shift.started) &&
        s.wasReviewed &&
        s.id !== shift.id
    );
  };

  const isStudEmp = () => {
    try {
      return (
        store.getters["contentData/contractById"](shift.contract)
          .worktimeModelName === "studEmp"
      );
    } catch {
      return false;
    }
  };

  const alreadyClockedWorktime = () => {
    return shiftsThisDay().reduce(
      (workMinutes, s) => workMinutes + (s.stopped - s.started) / 60000,
      0
    );
  };

  const totalBreaktime = () => {
    const shifts = shiftsThisDay();
    if (!shifts.length) return 0;

    let totalBreak = 0;
    for (let i = 0; i < shifts.length - 1; i++) {
      totalBreak += shifts[i + 1].started - shifts[i].stopped;
    }

    if (shift.started >= shifts[shifts.length - 1].stopped) {
      return (
        (shift.started - shifts[shifts.length - 1].stopped + totalBreak) / 60000
      );
    }
    if (shift.stopped <= shifts[0].started) {
      return (shifts[0].started - shift.stopped + totalBreak) / 60000;
    }

    return (totalBreak - (shift.stopped - shift.started)) / 60000;
  };

  const checkShiftErrors = () => {
    const messages = [
      validateStartedBeforeStopped(),
      validateOnlyHolidayOnHolidays(),
      validateHolidayOnWorkdays(),
      validateExclusivityVacation(),
      validateExclusivitySick(),
      validateOverlapping(),
      validateInLockedMonth()
    ].filter((message) => message !== null);
    if (messages.length > 0) errorMessages.value = messages;
  };

  const checkShiftWarnings = () => {
    const messages = [
      checkEightTwentyRule(),
      validateMaxWorktimePerDay(),
      validateNoSunday(),
      checkAutomaticWorktimeCutting()
    ].filter((message) => message !== null);
    if (messages.length > 0) alertMessages.value = messages;
  };
  const validateShift = () => {
    if (!isShiftValid()) return;
    checkShiftErrors();
    checkShiftWarnings();
  };

  const valid = computed(() => errorMessages.value.length === 0);

  watch(shift, validateShift, { immediate: true });

  return {
    alertMessages,
    errorMessages,
    valid
  };
}
