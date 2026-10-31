import { describe, expect, it } from "vitest";
import { normalizeEgyptPhone } from "@nosa/contracts";

describe("normalizeEgyptPhone", () => {
  it.each([
    ["01012345678", "+201012345678"],
    ["+20 101 234 5678", "+201012345678"],
    ["00201112345678", "+201112345678"],
    ["201212345678", "+201212345678"],
    ["٠١٥١٢٣٤٥٦٧٨", "+201512345678"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeEgyptPhone(input)).toBe(expected);
  });

  it.each(["0131234567", "12345", "+14155550123", "010123456789"])("rejects %s", (input) => {
    expect(normalizeEgyptPhone(input)).toBeNull();
  });
});
