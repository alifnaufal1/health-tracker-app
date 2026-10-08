import { formatDistanceKm, formatPace } from "@/presentation/utils/formatters";

describe("formatPace()", () => {
  describe("normal scenario", () => {
    test.each`
      secPerKm  | expected
      ${330}    | ${"5:30"}
      ${360}    | ${"6:00"}
      ${245}    | ${"4:05"}
      ${330.4}  | ${"5:30"}
      ${330.69} | ${"5:31"}
      ${359.6}  | ${"6:00"}
      ${359.5}  | ${"6:00"}
      ${600}    | ${"10:00"}
    `(
      "returns $expected when input is $secPerKm sec/km",
      ({ secPerKm, expected }) => {
        expect(formatPace(secPerKm)).toBe(expected);
      },
    );
  });

  // pace '0' shows as '0:00', this follow the habit of other run app
  // input 0 is lower edge
  // input 59, 60, 61 are logic transition edge
  describe("edge cases scenario", () => {
    test.each`
      secPerKm | expected
      ${0}     | ${"0:00"}
      ${59}    | ${"0:59"}
      ${60}    | ${"1:00"}
      ${61}    | ${"1:01"}
    `(
      "returns $expected when input is $secPerKm sec/km",
      ({ secPerKm, expected }) => {
        expect(formatPace(secPerKm)).toBe(expected);
      },
    );
  });

  // 'undefined' will shows as '--:--' pace can comes from object that can be null
  describe("broken scenario", () => {
    test.each`
      secPerKm     | expected
      ${-1}        | ${"--:--"}
      ${NaN}       | ${"--:--"}
      ${Infinity}  | ${"--:--"}
      ${undefined} | ${"--:--"}
    `(
      "returns $expected when input is $secPerKm sec/km",
      ({ secPerKm, expected }) => {
        expect(formatPace(secPerKm)).toBe(expected);
      },
    );
  });

  // formatter just do a formatting, and doesn't assess the reasonableness of the value
  describe("weird scenario", () => {
    test.each`
      secPerKm | expected
      ${1}     | ${"0:01"}
      ${86400} | ${"1440:00"}
    `(
      "returns $expected when input is $secPerKm sec/km",
      ({ secPerKm, expected }) => {
        expect(formatPace(secPerKm)).toBe(expected);
      },
    );
  });
});

describe("formatDistanceKm()", () => {
  describe("normal scenario", () => {
    test.each`
      distanceMeters | expected
      ${1000}        | ${"1.00"}
      ${21870}       | ${"21.87"}
      ${500}         | ${"0.50"}
      ${10500}       | ${"10.50"}
      ${1234.56}     | ${"1.23"}
      ${1235.67}     | ${"1.24"}
      ${6037}        | ${"6.04"}
    `(
      "returns $expected when input is $distanceMeters meters",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });

  // A distance of zero is considered valid data indicating a newly started running activity
  // An input of 0.5 meters tests the two-decimal rounding limit for values ​​under 1 meter
  describe("edge cases scenario", () => {
    test.each`
      distanceMeters | expected
      ${0}           | ${"0.00"}
      ${0.5}         | ${"0.00"}
      ${5}           | ${"0.01"}
      ${999}         | ${"1.00"}
      ${1001}        | ${"1.00"}
      ${1065}        | ${"1.07"}
      ${1035}        | ${"1.04"}
      ${5035}        | ${"5.04"}
      ${10035}       | ${"10.04"}
    `(
      "returns $expected when input is $distanceMeters meters",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });

  // Negative values ​​and invalid types are returned as "--" to maintain UI consistency.
  describe("broken scenario", () => {
    test.each`
      distanceMeters | expected
      ${-1000}       | ${"--"}
      ${NaN}         | ${"--"}
      ${Infinity}    | ${"--"}
      ${undefined}   | ${"--"}
    `(
      "returns $expected when input is $distanceMeters meters",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });

  describe("weird scenario", () => {
    test.each`
      distanceMeters | expected
      ${1}           | ${"0.00"}
      ${40075000}    | ${"40075.00"}
    `(
      "returns $expected when input is $distanceMeters meters",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });
});
