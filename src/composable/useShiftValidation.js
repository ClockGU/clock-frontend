import { ref, computed, watch, toValue } from "vue";
import { dateIsHoliday } from "@/utils/date";
import { isSameMonth, isSameDay } from "date-fns";
import store from "@/store";
import VueI18n from "@/plugins/i18n";

export function useShiftValidation(shiftSource, isLive = false) {
  const errorMessages = ref([]);
  const alertMessages = ref([]);

  // a computed property to ensure we always have the latest object reference
  const shift = computed(() => toValue(shiftSource));

  const t = (key) => VueI18n.global.t(key);
  
  const isShiftValid = () => Boolean(shift.value);

  const validateStartedBeforeStopped = () => {
    return shift.value.started > shift.value.stopped
      ? t("shifts.errors.startedBeforeStopped")
      : null;
  };

  const validateMaxWorktimePerDay = () => {
    let newShiftWorktime = (shift.value.stopped - shift.value.started) / 60000;
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
    const newShiftWorktime = (shift.value.stopped - shift.value.started) / 60000;
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
    return dateIsHoliday(shift.value.started) && shift.value.type !== "bh"
      ? t("shifts.errors.workingOnHolidays")
      : null;
  };

  const validateHolidayOnWorkdays = () => {
    return shift.value.type === "bh" && !dateIsHoliday(shift.value.started)
      ? t("shifts.errors.holidayOnWorkday")
      : null;
  };

  const validateNoSunday = () => {
    return shift.value.started.getDay() === 0
      ? t("shifts.errors.workingOnSundays")
      : null;
  };

  const validateExclusivityVacation = () => {
    const shifts = shiftsThisDay();
    if (
      (shift.value.type === "vn" && shifts.some((s) => s.type !== "vn")) ||
      (shift.value.type === "st" && shifts.some((s) => s.type === "vn"))
    ) {
      return t("shifts.errors.exclusiveVacation");
    }
    return null;
  };

  const validateExclusivitySick = () => {
    const shifts = shiftsThisDay();
    if (
      (shift.value.type === "sk" && shifts.some((s) => s.type !== "sk")) ||
      (shift.value.type === "st" && shifts.some((s) => s.type === "sk"))
    ) {
      return t("shifts.errors.exclusiveSick");
    }
    return null;
  };

  const validateOverlapping = () => {
    for (let s of shiftsThisDay()) {
      if (s.started <= shift.value.started && shift.value.started < s.stopped) {
        return t("shifts.errors.overlappingStarted");
      }
      if (s.started < shift.value.stopped && shift.value.stopped <= s.stopped) {
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
    return shift.value.started.getHours() < 8 || shift.value.stopped.getHours() > 20
      ? t("shifts.errors.eightTwentyRule")
      : null;
  };

  const shiftsThisDay = () => {
    return store.getters["contentData/allShifts"].filter(
      (s) =>
        isSameDay(s.started, shift.value.started) &&
        s.wasReviewed &&
        s.id !== shift.value.id
    );
  };

  const shiftsThisMonth = () => {
    return store.getters["contentData/selectedShifts"].filter(
      (s) =>
        isSameMonth(s.started, shift.value.started) &&
        s.wasReviewed &&
        s.id !== shift.value.id
    );
  };

  const isStudEmp = () => {
    try {
      return (
        store.getters["contentData/contractById"](shift.value.contract)
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

    if (shift.value.started >= shifts[shifts.length - 1].stopped) {
      return (
        (shift.value.started - shifts[shifts.length - 1].stopped + totalBreak) / 60000
      );
    }
    if (shift.value.stopped <= shifts[0].started) {
      return (shifts[0].started - shift.value.stopped + totalBreak) / 60000;
    }

    return (totalBreak - (shift.value.stopped - shift.value.started)) / 60000;
  };

  const checkShiftErrors = () => {
    const type = isLive ? "isLive" : "regular";
    const messages = rules[type].validations
      .map((rule) => rule())
      .filter((message) => message !== null);
    if (messages.length > 0) errorMessages.value = messages;
  };

  const checkShiftWarnings = () => {
    const type = isLive ? "isLive" : "regular";
    const messages = rules[type].warnings
      .map((rule) => rule())
      .filter((message) => message !== null);
    if (messages.length > 0) alertMessages.value = messages;
  };

  const validateShift = () => {
    if (!isShiftValid()) return;
    clearMessages();
    checkShiftErrors();
    checkShiftWarnings();                                   
  };

  const clearMessages = () => {
    errorMessages.value = [];
    alertMessages.value = [];
  };

  const rules = {
    isLive: {
      validations: [
        validateOnlyHolidayOnHolidays,
        validateHolidayOnWorkdays,
        validateExclusivityVacation,
        validateExclusivitySick,
        validateInLockedMonth
      ],
      warnings: [
        checkEightTwentyRule,
        validateMaxWorktimePerDay,
        validateNoSunday,
        checkAutomaticWorktimeCutting
      ]
    },
    regular: {
      validations: [
        validateStartedBeforeStopped,
        validateOnlyHolidayOnHolidays,
        validateHolidayOnWorkdays,
        validateExclusivityVacation,
        validateExclusivitySick,
        validateOverlapping,
        validateInLockedMonth
      ],
      warnings: [
        checkEightTwentyRule,
        validateMaxWorktimePerDay,
        validateNoSunday,
        checkAutomaticWorktimeCutting
      ]
    }
  };

  const valid = computed(() => errorMessages.value.length === 0);

  watch(shift, validateShift, { immediate: true, deep: true });

  return {
    alertMessages,
    errorMessages,
    valid,
    validateShift
  };
}