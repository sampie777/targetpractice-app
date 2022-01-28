import { bytesToString, stringToBytes } from "../../source/logic/utils";

describe("test utils", () => {
  it("converses string to bytes and the other way around", () => {
    expect(bytesToString(stringToBytes("Hello there :)"))).toBe("Hello there :)")
  })
});
