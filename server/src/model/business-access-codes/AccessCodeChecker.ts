/*
AccessCodeChecker.ts
Description: Given a business name and a decrypted access code, AccessCodeChecker will verify the the legitimacy of it.
Use Cases: used to validate Business authentication
*/

import AlphanumericCodeGenerator from "../../utils/random-generation/AlphanumericCodeGenerator";
import IRandomCodeGenerator from "../../utils/random-generation/IRandomCodeGenerator";
import BusinessNameDoesNotExistError from "../business-emails/error/BusinessNameDoesNotExistError";
import BusinessAccessCodeModel from "./BusinessAccessCodeModel";
import AccessCodeValidationError from "./error/AccessCodeValidationError";

export default class AccessCodeChecker {

    private _businessName: string;
    /** A class that implements IRandomCodeGenerator which is used to validate the decrypted code */
    private _accessCodeGenerator: IRandomCodeGenerator;
    private _decryptedCode: string;

    public constructor(businessName: string, decryptedCode: string, accessCodeGenerator: IRandomCodeGenerator = new AlphanumericCodeGenerator()) {
        this._businessName = businessName;
        this._accessCodeGenerator = accessCodeGenerator;
        this._decryptedCode = decryptedCode;
    }

    /**
     * This method throws an exception when a submitted business access code fails validation. Otherwise it returns void.
     */
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