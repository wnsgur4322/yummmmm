/*
BusinessAccessCodeModel.ts
Description: This model is used to generate and save an access code to the database for a business to use to login.
Use Cases: a business access code is either generated or updated every time a business authenticates
*/

import dynamo from "dynamodb";
import Joi from "joi";
import AlphanumericCodeGenerator from "../../utils/random-generation/AlphanumericCodeGenerator";
import IRandomCodeGenerator from "../../utils/random-generation/IRandomCodeGenerator";
import DynamoModel from "../../utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../utils/model/IDatabaseModel";
import BusinessNameDoesNotExistError from "../business-emails/error/BusinessNameDoesNotExistError";

/**
 * The Dynamo validation schema for business access codes
 */
const BusinessAccessCode = dynamo.define("BusinessAccessCode", {
    hashKey: "businessName",
    timestamps: false,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        accessCode: Joi.string(),
        expiresAt: Joi.number().integer().min(new Date(0).getTime())
    }
});

export default class BusinessAccessCodeModel {

    public static readonly _expirationTime = parseInt(process.env.ACCESS_CODE_EXPIRATION_TIME as string);

    /**
     * @param businessName the unique name of the business
     * @param encryptedAccessCode the access code that is encrypted
     * @returns a DynamoModel instance with businessName and encryptedAccessCode 
     */
    public static async create(businessName: string, encryptedAccessCode: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.create(BusinessAccessCode, "businessName",
            {
                businessName,
                accessCode: encryptedAccessCode,
                expiresAt: Date.now() + this._expirationTime
            });
        } catch (err) {
            throw err;
        }
    }
    /**
     * @param businessName the name of the business
     * @returns a DynamoModel instance with data loaded from the database
     */
    public static async getExistingModel(businessName: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessAccessCode, "businessName", businessName);
        } catch (err) {
            throw new BusinessNameDoesNotExistError(`The business "${businessName}" does not contain a model`);
        }
    }
}

