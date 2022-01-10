/*
BusinessAccountSettingsModel.ts
Description: A model for storing a specific business's account settings like operating hours and supported order fulfillment methods.
Use Cases: Can be modified by business on business account page, can be created by admin accounts
*/

import dynamo from "dynamodb";
import Joi from "joi";
import DynamoModel from "../../utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../utils/model/IDatabaseModel";
import IBusinessAccountSettings from "./IBusinessAccountSettings";
import { defaultWeeklyHours, defaultSupportedOrderFulfillmentOptions, defaultWeekDayHours } from "./defaultBusinessAccountSettings";

/**
 * The Dynamo validation schema for week day business hours
 */
const weekDayBusinessHoursSchema = Joi.object({
    isOperatingThisDay: Joi.boolean().default(true),
    openHour: Joi.number().min(0).max(23).default(0),
    openMinutes: Joi.number().min(0).max(59).default(0),
    closeHour: Joi.number().min(0).max(23).default(23),
    closeMinutes: Joi.number().min(0).max(59).default(59)
}).default(defaultWeekDayHours);

/**
 * BusinessAccountSettings is a Dynamo validation schema for various configuration settings specific to
 * a single business
 */
const BusinessAccountSettings = dynamo.define("BusinessAccountSetting", {
    hashKey: "businessName",
    timestamps: false,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        adminLevelPermissions: Joi.boolean().default(false),
        supportedOrderFulfillmentOptions: Joi.object({
            pickup: Joi.boolean().default(true),
            delivery: Joi.boolean().default(false),
            dineIn: Joi.boolean().default(false)
        }).default(defaultSupportedOrderFulfillmentOptions),
        weeklyHours: Joi.object({
            sunday: weekDayBusinessHoursSchema,
            monday: weekDayBusinessHoursSchema,
            tuesday: weekDayBusinessHoursSchema,
            wednesday: weekDayBusinessHoursSchema,
            thursday: weekDayBusinessHoursSchema,
            friday: weekDayBusinessHoursSchema,
            saturday: weekDayBusinessHoursSchema
        }).default(defaultWeeklyHours),
        isOpenForBusiness: Joi.boolean().default(false)
    }
});

export default class BusinessAccountSettingsModel {

    /**
     * @param businessName the unique name of the business that owns the account settings
     * @param businessAccountSettings the account settings themselves
     * @returns A DynamoModel instance that contains the business account settings for a particular business
     */
    public static async create(businessName: string, businessAccountSettings: IBusinessAccountSettings): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.create(BusinessAccountSettings, "businessName", { businessName, ...businessAccountSettings });
        } catch (err) {
            throw err;
        }
    }
    /**
     * @param businessName the unique name of the business used to retrieve the account settings
     * @returns A DynamoModel instance with business account settings data loaded from the database
     */
    public static async getExistingModel(businessName: string) {
        try {
            return await DynamoModel.getExistingModel(BusinessAccountSettings, "businessName", businessName);
        } catch (err) {
            throw err;
        }
    }
}