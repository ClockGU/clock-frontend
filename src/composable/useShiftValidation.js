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

  const isShiftValid = () => Boolean(shift.value && shift.value.started);

  const getNewShiftDuration = () => {
    if (!shift.value?.started) return 0;

    const start = shift.value.started;
    // Use current time if live or if stopped time is missing/invalid
    const end =
      isLive || !shift.value.stopped || isNaN(shift.value.stopped.getTime())
        ? new Date()
        : shift.value.stopped;

    return Math.max(0, (end - start) / 60000);
  };

  const validateStartedBeforeStopped = () => {
    if (isLive) return null;
    return shift.value.started > shift.value.stopped
      ? t("shifts.errors.startedBeforeStopped")
      : null;
  };

  const validateMaxWorktimePerDay = () => {
    let duration = getNewShiftDuration();
    const alreadyWorked = alreadyClockedWorktime();
    const totalWorktime = duration + alreadyWorked;

    if (
      totalWorktime > 6 * 60 &&
      totalWorktime <= 9 * 60 &&
      totalBreaktime() < 30
    ) {
      duration -= 30 - totalBreaktime();
    } else if (totalWorktime > 9 * 60 && totalBreaktime() < 45) {
      duration -= 45 - totalBreaktime();
    }

    return duration + alreadyWorked > 10 * 60
      ? t("shifts.errors.maximumWorktimePerDay")
      : null;
  };

  const checkAutomaticWorktimeCutting = () => {
    if (!shift.value?.started) return null;

    const duration = getNewShiftDuration();
    const alreadyWorked = alreadyClockedWorktime();
    const totalWorktime = duration + alreadyWorked;
    const breaks = totalBreaktime();


    if (totalWorktime > 9 * 60 && breaks < 45) {
      return t("shifts.errors.autoWorktimeCutting");
    }

    if (totalWorktime > 6 * 60 && breaks < 30) {
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
    if (!isStudEmp()) return null;

    const startHour = shift.value.started.getHours();

    // For live clock-in, check current start boundary
    if (isLive) {
      return startHour < 8 || startHour >= 20
        ? t("shifts.errors.eightTwentyRule")
        : null;
    }

    // For regular shifts, check both bounds
    const stopHour = shift.value.stopped?.getHours() || 0;
    return startHour < 8 || stopHour > 20
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
        (shift.value.started - shifts[shifts.length - 1].stopped + totalBreak) /
        60000
      );
    }
    if (shift.value.stopped <= shifts[0].started) {
      return (shifts[0].started - shift.value.stopped + totalBreak) / 60000;
    }

    return (totalBreak - (shift.value.stopped - shift.value.started)) / 60000;
  };
  const checkShiftErrors = () => {
    const mode = isLive ? "live" : "regular";
    errorMessages.value = rules[mode].validations
      .map((rule) => rule())
      .filter((m) => m !== null);
  };

  const checkShiftWarnings = () => {
    const mode = isLive ? "live" : "regular";
    alertMessages.value = rules[mode].warnings
      .map((rule) => rule())
      .filter((m) => m !== null);
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
    live: {
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

  // Deep watch the shift to trigger validation on any property change
  watch(shift, validateShift, { immediate: true, deep: true });

  return {
    alertMessages,
    errorMessages,
    valid
  };
}
