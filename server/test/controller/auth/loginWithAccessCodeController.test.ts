import dotenv from "dotenv";
dotenv.config();
//import loginWithAccessCodeController from "../../../src/controller/auth/loginWithAccessCodeController";
import initializeDynamo from "../../../src/dynamodb";
import AccessCodeSender from "../../../src/model/business-access-codes/AccessCodeSender";
import { mockExpressNext } from "../mockExpressNextFunction";
import MockExpressResponse from "../MockExpressResponse";

jest.setTimeout(60_000);

// Code from loginWithAccessCodeController.ts

import { Request, Response, NextFunction } from "express";
import AccessCodeChecker from "../../../src/model/business-access-codes/AccessCodeChecker";
import AccessCodeValidationError from "../../../src/model/business-access-codes/error/AccessCodeValidationError";
import HttpError from "../../../src/utils/http/error/HttpError";
import HttpSuccess from "../../../src/utils/http/success/HttpSuccess";
import IAuthToken from "../../../src/utils/auth/tokens/IAuthToken";
import JsonWebToken from "../../../src/utils/auth/tokens/JsonWebToken";

const loginWithAccessCodeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { businessName, accessCode } = req.body;
        // remove whitespace from accessCode
        accessCode = accessCode.replace(/\s/g, "");
        const accessCodeChecker = new AccessCodeChecker(businessName, accessCode);
        await accessCodeChecker.validate();
        // create the authentication token for the client and add it to cookies
        const webToken: IAuthToken = new JsonWebToken();
        const jwtToken = await webToken.generate(businessName);
        webToken.attachTokenToCookies(res, jwtToken);
        return new HttpSuccess(201, "You have been logged in successfully!").send(res);
    } catch (err) {
        if (err instanceof AccessCodeValidationError) {
            return next(new HttpError(400, err.message));
        }
        return next(new HttpError(500, (err as Error).message));
    }
};

// end of code from loginWithAccessCodeController.ts

initializeDynamo();

let accessCodeSender: AccessCodeSender;

beforeAll(async () => {
    accessCodeSender = new AccessCodeSender("Test Business");
    await accessCodeSender.send();
});


test("The access code is not accepted because it is incorrect", async () => {
    try {
        const responseFromServer =
        await loginWithAccessCodeController(
            { body: { businessName: "Test Business", accessCode: "0123456789" } } as any,
            new MockExpressResponse() as any,
            mockExpressNext as any
        );
        expect(responseFromServer).toEqual({
            statusCode: 400,
            status: "error",
            message: "Test Business does not have an active access code or the access code is incorrect."
        });
    } catch (err) {
        expect(err).toBe("");
    }
});

test("The access code is not accepted because the business is incorrect", async () => {
    try {
        const responseFromServer =
        await loginWithAccessCodeController(
            { body: { businessName: "nonsense", accessCode: "0123456789" } } as any,
            new MockExpressResponse() as any,
            mockExpressNext as any
        );
        expect(responseFromServer).toEqual({
            statusCode: 400,
            status: "error",
            message: "nonsense does not have an active access code or the access code is incorrect."
        });
    } catch (err) {
        expect(err).toBe("");
    }
});

test("The access code is accepted even with extra whitespace and the user is logged in", async () => {
    const responseFromServer =
    await loginWithAccessCodeController(
        { body: { businessName: "Test Business", accessCode: `  ${accessCodeSender.decryptedCode}     ` } } as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 201,
        status: "success",
        message: "You have been logged in successfully!"
    });
});

test("The access code is accepted and the user is logged in", async () => {
    const responseFromServer =
    await loginWithAccessCodeController(
        { body: { businessName: "Test Business", accessCode: accessCodeSender.decryptedCode } } as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 201,
        status: "success",
        message: "You have been logged in successfully!"
    });
});