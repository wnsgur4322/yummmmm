import dotenv from "dotenv";
dotenv.config();
import initializeDynamo from "../../../src/dynamodb";
//import AccessCodeChecker from "../../../src/model/business-access-codes/AccessCodeChecker";
import AccessCodeSender from "../../../src/model/business-access-codes/AccessCodeSender";
import AccessCodeValidationError from "../../../src/model/business-access-codes/error/AccessCodeValidationError";
import BusinessAccessCodeModel from "../../../src/model/business-access-codes/BusinessAccessCodeModel";

jest.setTimeout(60_000);

// code from AccessCodeChecker.ts

import AlphanumericCodeGenerator from "../../../src/utils/random-generation/AlphanumericCodeGenerator";
import IRandomCodeGenerator from "../../../src/utils/random-generation/IRandomCodeGenerator";
import BusinessNameDoesNotExistError from "../../../src/model/business-emails/error/BusinessNameDoesNotExistError";

class AccessCodeChecker {

    private _businessName: string;
    private _accessCodeGenerator: IRandomCodeGenerator;
    private _decryptedCode: string;

    public constructor(businessName: string, decryptedCode: string, accessCodeGenerator: IRandomCodeGenerator = new AlphanumericCodeGenerator()) {
        this._businessName = businessName;
        this._accessCodeGenerator = accessCodeGenerator;
        this._decryptedCode = decryptedCode;
    }

    public async validate(): Promise<void> {
        try {
            const businessAccessCodeModel = await BusinessAccessCodeModel.getExistingModel(this._businessName);
            const { accessCode, expiresAt } = await businessAccessCodeModel.read();
            // raise an error if the code is expired or just wrong
            if (expiresAt < Date.now()) {
                throw new AccessCodeValidationError(`${this._businessName} does not have an active access code or the access code is incorrect.`);
            } else if (!(await this._accessCodeGenerator.compare(accessCode, this._decryptedCode))) {
                throw new AccessCodeValidationError(`${this._businessName} does not have an active access code or the access code is incorrect.`); 
            }
        } catch (err) {
            // if the business does not exist also raise an error
            if (err instanceof BusinessNameDoesNotExistError) {
                throw new AccessCodeValidationError(`${this._businessName} does not have an active access code or the access code is incorrect.`);
            }
            throw err;
        }
    }
}

initializeDynamo();

let decryptedCode = "";
let accessCodeSender: AccessCodeSender;

beforeAll(async () => {
    accessCodeSender = new AccessCodeSender("Test Business");
    await accessCodeSender.send();
});

test("AccessCodeChecker validates the access code successfully, as it is correct and not expired", async () => {
    try {
        decryptedCode = accessCodeSender.decryptedCode as string;
        const accessCodeChecker = new AccessCodeChecker("Test Business", decryptedCode);
        await accessCodeChecker.validate();
        expect(true).toBe(true);
    } catch (err) {
        // problem if there is an error
        expect(err).toBe("");
    }
});

test("AccessCodeChecker validation fails because the code is not correct", async () => {
    try {
        const accessCodeChecker = new AccessCodeChecker("Test Business", "1234567890");
        await accessCodeChecker.validate();
        // problem if no error is raised
        expect(true).toBe(false);
    } catch (err) {
        expect(err instanceof AccessCodeValidationError).toBe(true);
    }
});

test("AccessCodeChecker validation fails because the code has expired", async () => {
    try {
        const businessName = "Test Business";
        // force the code to expire for testing purposes
        const businessAccessCodeModel = await BusinessAccessCodeModel.getExistingModel(businessName);
        await businessAccessCodeModel.update({ expiresAt: Date.now() });
        const accessCodeChecker = new AccessCodeChecker(businessName, decryptedCode);
        await accessCodeChecker.validate();
        // problem if no error is raised
        expect(true).toBe(false);
    } catch (err) {
        expect(err instanceof AccessCodeValidationError).toBe(true);
    }
});