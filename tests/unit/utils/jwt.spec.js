import { parseJwt } from "@/utils/jwt";

describe("parseJwt function", () => {
  it("parses JWT and returns JSON", () => {
    // Dummy JWT from https://jwt.io/
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    expect(parseJwt(jwt)).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022
    });
  });
});
