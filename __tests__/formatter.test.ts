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
  describe("edge cases scenario", () => {
    test.each`
      secPerKm | expected
      ${0}     | ${"0:00"}
      ${59}    | ${"0:59"}
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
      ${123}         | ${"0.12"}
      ${135}         | ${"0.14"}
      ${147}         | ${"0.15"}
      ${159}         | ${"0.16"}
      ${19}          | ${"0.02"}
      ${45}          | ${"0.04"}
      ${87}          | ${"0.09"}
      ${1900}        | ${"1.90"}
      ${1905}        | ${"1.91"}
      ${1605}        | ${"1.61"}
    `(
      "returns $expected when input is $distanceMeters m",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });
  describe("edge case scenario", () => {
    test.each`
      distanceMeters | expected
      ${135}         | ${"0.14"}
      ${147}         | ${"0.15"}
      ${159}         | ${"0.16"}
      ${19}          | ${"0.02"}
      ${45}          | ${"0.04"}
      ${87}          | ${"0.09"}
    `(
      "returns $expected when input is $distanceMeters m",
      ({ distanceMeters, expected }) => {
        expect(formatDistanceKm(distanceMeters)).toBe(expected);
      },
    );
  });
});
