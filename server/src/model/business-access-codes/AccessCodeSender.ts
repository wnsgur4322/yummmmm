/*
AccessCodeSender.ts
Description: Given a valid company name, AccessCodeSender will send an email to the registered company email with the access code used to authenticate
Use Cases: Sends generated access codes for company authentication
*/
import BasicMailer from "../../utils/mail/BasicMailer";
import DatabaseModelNotFoundError from "../../utils/model/dynamodb/error/DatabaseModelNotFoundError";
import AlphanumericCodeGenerator from "../../utils/random-generation/AlphanumericCodeGenerator";
import IRandomCodeGenerator from "../../utils/random-generation/IRandomCodeGenerator";
import BusinessEmailModel from "../business-emails/BusinessEmailModel";
import BusinessNameDoesNotExistError from "../business-emails/error/BusinessNameDoesNotExistError";
import BusinessAccessCodeModel from "./BusinessAccessCodeModel";

export default class AccessCodeSender {

    private _businessName: string;
    private _accessCodeGenerator: IRandomCodeGenerator;
    private _decryptedCode: string | undefined;
    private _encryptedCode: string | undefined;

    public constructor(businessName: string, accessCodeGenerator: IRandomCodeGenerator = new AlphanumericCodeGenerator()) {
        this._businessName = businessName;
        this._accessCodeGenerator = accessCodeGenerator;
    }

    /**
     * @returns a two-element array with the 0th element being the decrypted code and the 1st element being the encrypted code.
     */
    public async getDecryptedEncryptedCodes(): Promise<[string, string]> {
        try {
            const decryptedCode = await this._accessCodeGenerator.generate(10);
            const encryptedCode = await this._accessCodeGenerator.asEncrypted(decryptedCode);
            return [decryptedCode, encryptedCode];
        } catch (err) {
            throw err;
        }
    }

    /**
     * The method "send" either successfully sends the decrypted code to the business's email or it throws an exception.
     */
    public async send(): Promise<void> {
        try {
            [this._decryptedCode, this._encryptedCode] = await this.getDecryptedEncryptedCodes();
            const businessEmailModel = await BusinessEmailModel.getExistingModel(this._businessName);
            const { businessEmail } = await businessEmailModel.read();
            await BusinessAccessCodeModel.create(this._businessName, this._encryptedCode);
            await new BasicMailer(businessEmail).sendEmail(`Your access code for ${process.env.APP_NAME}`, `Hello ${this._businessName}! Your access code to login to your business account is <strong>${this._decryptedCode}</strong> and it is valid for about five minutes.`);
        } catch (err) {
            if (err instanceof DatabaseModelNotFoundError) {
                throw new BusinessNameDoesNotExistError(`The business name "${this._businessName}" is not a registered business.`);
            }
            throw err;
        }
    }

    public get decryptedCode() { return this._decryptedCode; }
}