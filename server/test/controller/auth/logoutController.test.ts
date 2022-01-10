import dotenv from "dotenv";
dotenv.config();
import logoutController from "../../../src/controller/auth/logoutController";
import MockExpressResponse from "../MockExpressResponse";
import { mockExpressNext } from "../mockExpressNextFunction";
const { JWT_TOKEN_NAME } = process.env;


test("User is successfully logged out even without an active token.", async () => {
    const responseFromServer =
    await logoutController(
        {} as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 200,
        status: "success",
        message: "The operation was successful."
    });
});

test("User is successfully logged out with an active token.", async () => {
    const mockExpressResponse = new MockExpressResponse();
    mockExpressResponse.cookie(JWT_TOKEN_NAME as string, "token", {});
    const responseFromServer =
    await logoutController(
        {} as any,
        mockExpressResponse as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 200,
        status: "success",
        message: "The operation was successful."
    });
});