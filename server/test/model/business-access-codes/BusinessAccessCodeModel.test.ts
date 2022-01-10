import dotenv from "dotenv";
dotenv.config();
import lodash from "lodash";
import initializeDynamo from "../../../src/dynamodb";

jest.setTimeout(60_000);

// Code from BusinessAccessCodeModel.ts

import dynamo from "dynamodb";
import Joi from "joi";
import AlphanumericCodeGenerator from "../../../src/utils/random-generation/AlphanumericCodeGenerator";
import IRandomCodeGenerator from "../../../src/utils/random-generation/IRandomCodeGenerator";
import DynamoModel from "../../../src/utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../../src/utils/model/IDatabaseModel";

const BusinessAccessCode = dynamo.define("BusinessAccessCode", {
    hashKey: "businessName",
    timestamps: false,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        accessCode: Joi.string().alphanum().length(10),
        expiresAt: Joi.number().integer().min(new Date(0).getTime())
    }
});

export default class BusinessAccessCodeModel {

    public static readonly _expirationTime = (1000 * 60 * 5);

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

    public static async getExistingModel(businessName: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessAccessCode, "businessName", businessName);
        } catch (err) {
            throw err;
        }
    }
}

// end of code from BusinessAccessCodeModel.ts

initializeDynamo();

test("BusinessAccessCodeModel should save an instance to the database given a valid business name",
async () => {
    try {
        const businessAccessCodeModel = await BusinessAccessCodeModel.create("Test Org", "1234567890") as DynamoModel;
        const readBusinessAccessCodeModel = await BusinessAccessCodeModel.getExistingModel("Test Org") as DynamoModel;
        const bothAreEqualByValue = lodash.isEqual(await businessAccessCodeModel.read(), await readBusinessAccessCodeModel.read());
        await businessAccessCodeModel.delete();
        expect(bothAreEqualByValue).toBe(true);
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});

test("BusinessAccessCodeModel generates an appropriate timestamp given the delay specified in BusinessAccessCodeModel",
async () => {
    try {
        const businessAccessCodeModel = await BusinessAccessCodeModel.create("Random Org", "1234567890") as DynamoModel;
        const { expiresAt } = await businessAccessCodeModel.read();
        const timestampIsAppropriatePlusOrMinus10Seconds = expiresAt < Date.now() + BusinessAccessCodeModel._expirationTime && expiresAt > Date.now() + BusinessAccessCodeModel._expirationTime - 10000;
        await businessAccessCodeModel.delete();
        expect(timestampIsAppropriatePlusOrMinus10Seconds).toBe(true);
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});

test("BusinessAccessCodeModel throws an error because the organization name is too long", async () => {
    try {
        const businessAccessCodeModel = await BusinessAccessCodeModel.create("Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name Really super duper long name", "1234567890") as DynamoModel;
    } catch (err) {
        expect(err instanceof Error).toBe(true);
    }
});

