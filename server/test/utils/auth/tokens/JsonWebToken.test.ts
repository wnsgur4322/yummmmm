import InvalidAuthTokenError from "../../../../src/utils/auth/tokens/error/InvalidAuthTokenError";
import JsonWebToken from "../../../../src/utils/auth/tokens/JsonWebToken";
import MockExpressResponseWithCookies from "./MockExpressResponseWithCookies";

jest.setTimeout(60_000);

let mockResponse: MockExpressResponseWithCookies;
let webToken: JsonWebToken;

beforeAll(() => {
    mockResponse = new MockExpressResponseWithCookies();
    webToken = new JsonWebToken();
});

test("JsonWebToken generates token properly", async () => {
    const token = await webToken.generate("Hello");
    const decoded = await webToken.validateAndDecodeToken(token);
    expect(decoded).toBe("Hello");
});

test("JsonWebToken properly adds cookie to res", () => {
    webToken.attachTokenToCookies(mockResponse as any, "something");
    expect(mockResponse.hasCookie("client-token")).toBe(true);
});

test("JsonWebToken properly removes cookie from res", () => {
    webToken.clearTokenFromCookies(mockResponse as any, "client-token");
    expect(mockResponse.hasCookie("client-token")).toBe(false);
});

test("JsonWebToken raises error because the token is invalid", async () => {
    try {
        await webToken.validateAndDecodeToken("wrong");
    } catch (err) {
        expect(err instanceof InvalidAuthTokenError).toBe(true);
    }
});

test("JsonWebToken raises error because the token is expired", async () => {
    try {
        const token = await webToken.generate("something", "secret", 0);
        await webToken.validateAndDecodeToken(token, "secret");
    } catch (err) {
        expect(err instanceof InvalidAuthTokenError).toBe(true);
    }
});

test("JsonWebToken validation succeeds because the token is valid and it has not yet expired", async () => {
    try {
        const token = await webToken.generate("something");
        const decoded = await webToken.validateAndDecodeToken(token);
        expect(decoded).toBe("something");
    } catch (err) {
        expect(err).toBe("");
    }
});


