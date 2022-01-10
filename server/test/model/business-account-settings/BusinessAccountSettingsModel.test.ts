import dotenv from "dotenv";
dotenv.config();
import initializeDynamo from "../../../src/dynamodb";

jest.setTimeout(60_000);

import lodash from "lodash";
import DynamoModel from "../../../src/utils/model/dynamodb/DynamoModel";

// code from BusinessAccountSettingsModel.ts

import dynamo from "dynamodb";
import Joi from "joi";
import IDatabaseModel from "../../../src/utils/model/IDatabaseModel";
import IBusinessAccountSettings from "../../../src/model/business-account-settings/IBusinessAccountSettings";
import { defaultWeeklyHours, defaultSupportedOrderFulfillmentOptions, defaultWeekDayHours } from "../../../src/model/business-account-settings/defaultBusinessAccountSettings";

const weekDayBusinessHoursSchema = Joi.object({
    isOperatingThisDay: Joi.boolean().default(true),
    openHour: Joi.number().min(0).max(23).default(0),
    openMinutes: Joi.number().min(0).max(59).default(0),
    closeHour: Joi.number().min(0).max(23).default(23),
    closeMinutes: Joi.number().min(0).max(59).default(59)
}).default(defaultWeekDayHours);

const BusinessAccountSettings = dynamo.define("BusinessAccountSetting", {
    hashKey: "businessName",
    timestamps: false,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        supportedOrderFulfillmentOptions: Joi.object({
            mayPickup: Joi.boolean().default(true),
            mayDeliver: Joi.boolean().default(false),
            mayDineIn: Joi.boolean().default(false)
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

    public static async create(businessName: string, businessAccountSettings: IBusinessAccountSettings): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.create(BusinessAccountSettings, "businessName", { businessName, ...businessAccountSettings });
        } catch (err) {
            throw err;
        }
    }

    public static async getExistingModel(businessName: string) {
        try {
            return await DynamoModel.getExistingModel(BusinessAccountSettings, "businessName", businessName);
        } catch (err) {
            throw err;
        }
    }
}

// End of code from BusinessAccountSettingsModel.ts

initializeDynamo();

const correctDefaultBusinessAccountSettings = {
    supportedOrderFulfillmentOptions: defaultSupportedOrderFulfillmentOptions,
    weeklyHours: defaultWeeklyHours,
    isOpenForBusiness: false
};

test("BusinessAccountSettingsModel successfully saves an instance with the correct default configurations to the database", async () => {
    try {
        const businessAccountSettingsModel = await BusinessAccountSettingsModel.create("Test Org", {}) as DynamoModel;
        const readBusinessAccountSettingsModel = await BusinessAccountSettingsModel.getExistingModel("Test Org") as DynamoModel;
        const bothAreEqualByValue = lodash.isEqual(await readBusinessAccountSettingsModel.read(), { businessName: "Test Org", ...correctDefaultBusinessAccountSettings });
        expect(bothAreEqualByValue).toBe(true);
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});

test("BusinessAccountSettingsModel successfully creates with partial information provided", async () => {
    try {
        const businessAccountSettingsModel = await BusinessAccountSettingsModel.create("Test Org", {
            supportedOrderFulfillmentOptions: {
                delivery: true
            },
            weeklyHours: {
                sunday: {
                    isOperatingThisDay: true,
                    openHour: 7,
                    openMinutes: 0,
                    closeHour: 22,
                    closeMinutes: 0
                }
            },
            isOpenForBusiness: true
        }) as DynamoModel;
        const bothAreEqualByValue = lodash.isEqual(await businessAccountSettingsModel.read(), {
            businessName: "Test Org",
            supportedOrderFulfillmentOptions: {
                ...defaultSupportedOrderFulfillmentOptions,
                mayDeliver: true,
            },
            weeklyHours: {
                ...defaultWeeklyHours,
                sunday: {
                    isOperatingThisDay: true,
                    openHour: 7,
                    openMinutes: 0,
                    closeHour: 22,
                    closeMinutes: 0
                }
            },
            isOpenForBusiness: true
        });
        expect(bothAreEqualByValue).toBe(true);
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});
