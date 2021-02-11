import {
  isNumeric,
  parseDublet,
  parseMultiplet,
  parseString,
  parseStringWithoutColon,
  parseTriplet,
  splitStringAtColon,
  startEndHours,
  timedeltaToMinutes,
  validateTimeInput
} from "@/utils/time";

describe("when 'isNumeric' is given a value", () => {
  it("returns true if value is a number", () => {
    expect(isNumeric(1)).toEqual(true);
  });

  it("returns true if value is a number in a string", () => {
    expect(isNumeric("1")).toEqual(true);
  });

  it("returns false if the string contains non-integer characters", () => {
    expect(isNumeric("1a")).toEqual(false);
  });
});

describe("when 'splitStringAtColon' receives a string", () => {
  it("will split it at the colon", () => {
    expect(splitStringAtColon("14:00")).toEqual(["14", "00"]);
  });

  it("will throw an error when passed a string with multiple colons", () => {
    expect(() => splitStringAtColon("14:00:00")).toThrow(Error);
  });
});

test("'parseDublet' can parse a single character", () => {
  expect(parseDublet("1")).toEqual(["1", "00"]);
});

test("'parseDublet' can parse two characters", () => {
  expect(parseDublet("11")).toEqual(["11", "00"]);
});

test("'parseTriplet' can parse three characters", () => {
  expect(parseTriplet("123")).toEqual(["1", "23"]);
});

test("'parseMultiplet' can parse four characters", () => {
  expect(parseMultiplet("1234")).toEqual(["12", "34"]);
});

test("'parseMultiplet' can parse more than four characters", () => {
  expect(parseMultiplet("123456")).toEqual(["12", "34"]);
});

describe("when 'parseStringWithoutColon' receives a string", () => {
  it("can parse the single value", () => {
    expect(parseStringWithoutColon("1")).toEqual(["1", "00"]);
  });

  it("can parse the dublet", () => {
    expect(parseStringWithoutColon("11")).toEqual(["11", "00"]);
  });

  it("can parse the triplet", () => {
    expect(parseStringWithoutColon("123")).toEqual(["1", "23"]);
  });

  it("can parse the quadruplet", () => {
    expect(parseStringWithoutColon("1234")).toEqual(["12", "34"]);
  });

  it("can parse the multiplet", () => {
    expect(parseStringWithoutColon("123456")).toEqual(["12", "34"]);
  });
});

describe("when 'parseString' receives a value", () => {
  it("can handle 'HH:mm' input", () => {
    expect(parseString("14:00")).toEqual(["14", "00"]);
  });

  it("can handle 'HH:' input", () => {
    expect(parseString("14:")).toEqual(["14", "00"]);
  });

  it("can transform '123456:00' into '12:34", () => {
    expect(parseString("123456:00")).toEqual(["12", "34"]);
  });
});

describe("when 'validateTimeInput' receives a value", () => {
  it("can handle 'HH:mm' input", () => {
    expect(validateTimeInput("14:00")).toEqual("14:00");
  });

  it("can handle 'HH:m' input", () => {
    expect(validateTimeInput("14:0")).toEqual("14:00");
  });

  it("can handle 'HH:' input", () => {
    expect(validateTimeInput("14:")).toEqual("14:00");
  });

  it("can handle 'HHmm' input", () => {
    expect(validateTimeInput("1400")).toEqual("14:00");
  });

  it("can handle 'Hmm' input", () => {
    expect(validateTimeInput("140")).toEqual("01:40");
  });

  it("can handle 'HH' input", () => {
    expect(validateTimeInput("14")).toEqual("14:00");
  });

  it("can handle 'H' input", () => {
    expect(validateTimeInput("1")).toEqual("01:00");
  });

  it("throws an error if the hour input is not a number", () => {
    expect(() => validateTimeInput("1a:00")).toThrow(Error);
  });

  it("throws an error if the minut input is not a number", () => {
    expect(() => validateTimeInput("01:0a")).toThrow(Error);
  });

  it("throws an error if the hour input is invalid", () => {
    expect(() => validateTimeInput("24:10")).toThrow(Error);
  });

  it("throws an error if the hour input is invalid", () => {
    expect(() => validateTimeInput("14:60")).toThrow(Error);
  });
});

describe("When handling a timedelta", () => {
  it("converts '10:00:00' to 600 minutes", () => {
    expect(timedeltaToMinutes("10:00:00")).toEqual(600);
  });

  it("converts '00:00:00' to 0 minutes", () => {
    expect(timedeltaToMinutes("00:00:00")).toEqual(0);
  });

  it("converts '1 00:00:00' to 1440 minutes", () => {
    expect(timedeltaToMinutes("1 00:00:00")).toEqual(1440);
  });

  it("converts '-1 16:00:00' to -480 minutes", () => {
    expect(timedeltaToMinutes("-1 16:00:00")).toEqual(-480);
  });

  it("converts '-5 16:00:00' to -5820 minutes", () => {
    expect(timedeltaToMinutes("-5 23:00:00")).toEqual(-5820);
  });
});

describe("startEndHours()", () => {
  it("always return shift buffered one hour around current time", () => {
    expect(startEndHours(new Date(2018, 9, 1, 0, 0))).toEqual({
      start: new Date(2018, 9, 1, 0, 0),
      end: new Date(2018, 9, 1, 1, 0)
    });

    expect(startEndHours(new Date(2018, 9, 1, 0, 20))).toEqual({
      start: new Date(2018, 9, 1, 0, 20),
      end: new Date(2018, 9, 1, 1, 20)
    });

    expect(startEndHours(new Date(2018, 9, 1, 23))).toEqual({
      start: new Date(2018, 9, 1, 22, 59),
      end: new Date(2018, 9, 1, 23, 59)
    });

    expect(startEndHours(new Date(2018, 9, 1, 10, 25))).toEqual({
      start: new Date(2018, 9, 1, 9, 25),
      end: new Date(2018, 9, 1, 10, 25)
    });
  });
});
