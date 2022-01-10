/*
BusinessOrderModel.ts
Description: A BusinessOrderModel is a dynamo db model that abstracts CRUD operations for a specific customer order.
Use Cases: When a customer purchases an order, the system will create an order dynamically using this model.
*/

import dynamo from "dynamodb";
import Joi from "joi";
import DynamoModel from "../../utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../utils/model/IDatabaseModel";
import BusinessAccountSettingsModel from "../business-account-settings/BusinessAccountSettingsModel";
import BusinessNameDoesNotExistError from "../business-emails/error/BusinessNameDoesNotExistError";

/**
 * A Dynamo validation schema for business orders
 */
const BusinessOrder = dynamo.define("BusinessOrder", {
    hashKey: "timestampWhenSubmitted",
    schema: {
        timestampWhenSubmitted: Joi.string().regex(/^\d+$/).required(),
        businessName: Joi.string().min(1).max(250).required(),
        customerEmail: Joi.string().email().required(),
        customerFirstName: Joi.string().min(1).max(100).required(),
        customerLastName: Joi.string().min(1).max(100).required(),
        orderFulfillmentOption: Joi.string().required(),
        timestampWhenOrderAccepted: Joi.string().regex(/^\d+$/).default("0"),
        timestampWhenOrderEstimatedDone: Joi.string().regex(/^\d+$/).default("0"),
        isCompleted: Joi.boolean().default(false),
        wasRejected: Joi.boolean().default(false)
    }
});

export default class BusinessOrderModel {

    /**
     * @param timestampWhenSubmitted Unix time of submission (same format as JavaScript Date.now())
     * @param businessName
     * @param customerEmail
     * @param customerFirstName
     * @param customerLastName 
     * @param orderFulfillmentOption 
     * @returns A DynamoModel instance with the business order data specified
     */
    public static async create(
        timestampWhenSubmitted: number | string,
        businessName: string,
        customerEmail: string,
        customerFirstName: string,
        customerLastName: string,
        orderFulfillmentOption: string,
    ) : Promise<IDatabaseModel> {
        try {
            try {
                const businessAccountSettingsModel = await BusinessAccountSettingsModel.getExistingModel(businessName);
                const { supportedOrderFulfillmentOptions } = await businessAccountSettingsModel.read();
                if (!orderFulfillmentOption || !supportedOrderFulfillmentOptions[orderFulfillmentOption]) {
                    throw new Joi.ValidationError(`The order fulfillment option specified is not allowed.`, undefined, undefined);
                }
            } catch (err) {
                if (err instanceof Joi.ValidationError)
                    throw err;
                else
                    throw new BusinessNameDoesNotExistError(`Your order failed to process because there is no such business named \"${businessName}\".`);
            }
            return await DynamoModel.create(BusinessOrder, "timestampWhenSubmitted",
            { timestampWhenSubmitted: `${timestampWhenSubmitted}`, businessName, customerEmail,
            customerFirstName, customerLastName, orderFulfillmentOption });
        } catch (err) {
            throw err;
        }
    }
    /**
     * @param timestampWhenSubmitted Unix time of submission (same format as JavaScript Date.now())
     * @returns true if the business order with `timestampWhenSubmitted` exists and false if it does not
     */
    public static async doesExist(timestampWhenSubmitted: number | string) : Promise<boolean> {
        try {
            const potentialBusinessOrderModel = await BusinessOrder.get(`${timestampWhenSubmitted}`);
            return potentialBusinessOrderModel === null ? false : true;
        } catch (err) {
            throw err;
        }
    }
    /**
     * @param timestampWhenSubmitted Unix time of submission (same format as JavaScript Date.now())
     * @returns a DynamoModel instance with the business order data from the database
     */
    public static async getExistingModel(timestampWhenSubmitted: number | string) : Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessOrder, "timestampWhenSubmitted", `${timestampWhenSubmitted}`);
        } catch (err) {
            throw err;
        }
    }
}
