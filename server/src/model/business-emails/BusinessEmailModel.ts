/*
BusinessEmailModel.ts
Description: This model is used as an interface between the businessemails table in the database and the server. It allows for CRUD operations
to be performed on the businessemails table.
Use Cases: the business email is queried on authentication/login
*/

import dynamo from "dynamodb";
import Joi from "joi";
import DynamoModel from "../../utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../utils/model/IDatabaseModel";

/**
 * The Dynamo validation schema used for the business email collection
 */
const BusinessEmail = dynamo.define("BusinessEmail", {
    hashKey: "businessName",
    timestamps: true,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        businessEmail: Joi.string().email()
    }
});

export default class BusinessEmailModel {

    /**
     * @param businessName the unique name of the business
     * @param businessEmail the email address of the business
     * @returns A DynamoModel instance with the business email data specified
     */
    public static async create(businessName: string, businessEmail: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.create(BusinessEmail, "businessName", { businessName, businessEmail });
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param businessName the unique name of the business
     * @returns true if the business has a registered email and false if it does not
     */
    public static async doesExist(businessName: string): Promise<boolean> {
        try {
            const potentialBusinessEmailModel = await BusinessEmail.get(businessName);
            return potentialBusinessEmailModel === null ? false : true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param businessName the unique name of the business
     * @returns A DynamoModel instance with the business email data from the database
     */
    public static async getExistingModel(businessName: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessEmail, "businessName", businessName);
        } catch (err) {
            throw err;
        }
    }
}