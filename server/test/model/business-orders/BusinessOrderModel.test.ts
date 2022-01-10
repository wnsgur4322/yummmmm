import dotenv from "dotenv";
dotenv.config();
import initializeDynamo from "../../../src/dynamodb";
import dynamo from "dynamodb";
import Joi from "joi";
import DynamoModel from "../../../src/utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../../src/utils/model/IDatabaseModel";
import BusinessNameDoesNotExistError from "../../../src/model/business-emails/error/BusinessNameDoesNotExistError";
import DatabaseModelNotFoundError from "../../../src/utils/model/dynamodb/error/DatabaseModelNotFoundError";

jest.setTimeout(60_000);

// code from BusinessAccountSettingsModel

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

class BusinessAccountSettingsModel {

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

// end of code from BusinessAccountSettingsModel

// beginning of code from BusinessOrderModel.ts

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

class BusinessOrderModel {

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

    public static async doesExist(timestampWhenSubmitted: number | string) : Promise<boolean> {
        try {
            const potentialBusinessOrderModel = await BusinessOrder.get(`${timestampWhenSubmitted}`);
            return potentialBusinessOrderModel === null ? false : true;
        } catch (err) {
            throw err;
        }
    }

    public static async getExistingModel(timestampWhenSubmitted: number | string) : Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessOrder, "timestampWhenSubmitted", timestampWhenSubmitted);
        } catch (err) {
            throw err;
        }
    }
}

// end of code from BusinessOrderModel.ts

let timestamp: string;
let businessName: string;
let customerEmail: string;
let customerFirstName: string;
let customerLastName: string;
let orderFulfillmentOption: string;

beforeAll(() => {
    initializeDynamo();
    timestamp = `${Date.now()}`;
    businessName = "Test Business";
    customerEmail = "testEmail@test.com";
    customerFirstName = "John";
    customerLastName = "Doe";
    orderFulfillmentOption = "pickUp";
});

test("BusinessOrderModel create method works as expected", async () => {
    try {
        const businessOrderModel = await BusinessOrderModel.create(timestamp, businessName, customerEmail, customerFirstName, customerLastName, orderFulfillmentOption);
        expect(await businessOrderModel.read()).toEqual({
            timestampWhenSubmitted: timestamp,
            businessName,
            customerEmail,
            customerFirstName,
            customerLastName,
            orderFulfillmentOption,
            timestampWhenOrderAccepted: "0",
            timestampWhenOrderEstimatedDone: "0",
            isCompleted: false,
            wasRejected: false
        });
        const businessOrderModel2 = await BusinessOrderModel.create(`${Date.now()}`, "complete utter nonsense", "testEmail@test.com", "Jane", "Smith", "dineIn");
        // fail test if no error occurs
        expect(false).toBe(true);
    } catch (err) {
        expect(err instanceof BusinessNameDoesNotExistError).toBe(true);
        //expect(err).toBe("");
    }
});

test("BusinessOrderModel getExistingModel method works as expected", async () => {
    try {
        const businessOrderModelThatExists = await BusinessOrderModel.getExistingModel(timestamp);
        expect(await businessOrderModelThatExists.read()).toEqual({
            timestampWhenSubmitted: timestamp,
            businessName,
            customerEmail,
            customerFirstName,
            customerLastName,
            orderFulfillmentOption,
            timestampWhenOrderAccepted: "0",
            timestampWhenOrderEstimatedDone: "0",
            isCompleted: false,
            wasRejected: false

        });
        const businessOrderModelThatDoesNotExist = await BusinessOrderModel.getExistingModel(0);
        // fail test if no error occurs
        expect(false).toBe(true);
    } catch (err) {
        expect(err instanceof DatabaseModelNotFoundError).toBe(true);
        //expect(err).toBe("");
    }
});

test("BusinessOrderModel doesExist method is accurate", async () => {
    const businessModelShouldExist = await BusinessOrderModel.doesExist(timestamp);
    expect(businessModelShouldExist).toBe(true);
    const businessOrderModel = await BusinessOrderModel.getExistingModel(timestamp);
    await businessOrderModel.delete();
    const businessModelShouldNotExist = !(await BusinessOrderModel.doesExist(timestamp));
    expect(businessModelShouldNotExist).toBe(true);
});