/*
Mailer.ts
Description: Mailer contains the email validation logic that is meant to be shared across derivations.
Use Cases: Classes that inherit from Mailer receive the validation logic
*/

import Joi from "joi";

export default abstract class Mailer {

    private _receiverEmailAddress: string;

    /** The protected constructor validates the email passed into it and if correct it saves it as a member. */
    protected constructor(receiverEmailAddress: string) {

        const validationResult = Joi.string().email().validate(receiverEmailAddress);
        if (validationResult.error) throw validationResult.error;
        this._receiverEmailAddress = receiverEmailAddress;
    }

    /**
     * @param subject the subject of the email
     * @param content the content which could be raw text or html
     */
    public abstract sendEmail(subject: string, content: string) : Promise<void>;

    public get receiverEmailAddress(): string { return this._receiverEmailAddress; }
}
