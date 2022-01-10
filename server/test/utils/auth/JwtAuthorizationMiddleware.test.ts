import dotenv from "dotenv";
import JwtAuthorizationMiddleware from "../../../src/utils/auth/JwtAuthorizationMiddleware";
import JsonWebToken from "../../../src/utils/auth/tokens/JsonWebToken";
import { mockExpressNext } from "../../controller/mockExpressNextFunction";
dotenv.config();

let middleware: JwtAuthorizationMiddleware;
let jwt: JsonWebToken;
let invalidToken: string;
let expiredToken: string;
let goodToken: string;

beforeAll(async () => {
    middleware = new JwtAuthorizationMiddleware();
    jwt = new JsonWebToken();
    invalidToken = "invalid";
    expiredToken = await jwt.generate("some id", "secret", 0);
    goodToken = await jwt.generate("some id");
});

test("The jwt is rejected because it is not defined on the header", async () => {
    const responseFromServer = await middleware.middleware(
        { headers: {} } as any,
        undefined as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The current token is invalid or has expired."
    });
});

test("The jwt is rejected because it is invalid", async () => {
    const responseFromServer = await middleware.middleware(
        { headers: { authorization: "wrong" } } as any,
        undefined as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The current token is invalid or has expired."
    });
});

test("The jwt is rejected because it is invalid", async () => {
    const responseFromServer = await middleware.middleware(
        { headers: { authorization: `Bearer ${invalidToken}` } } as any,
        undefined as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The current token is invalid or has expired."
    });
});

test("The jwt is rejected because it is expired", async () => {
    const responseFromServer = await middleware.middleware(
        { headers: { authorization: `Bearer ${expiredToken}` } } as any,
        undefined as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The current token is invalid or has expired."
    });
});

test("The jwt is accepted because it is valid", async () => {
    const responseFromServer = await middleware.middleware(
        { headers: { authorization: `Bearer ${goodToken}` } } as any,
        undefined as any,
        () => true
    );
    expect(responseFromServer).toBe(true);
});