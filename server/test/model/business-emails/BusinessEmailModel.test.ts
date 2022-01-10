import dotenv from "dotenv";
dotenv.config();
import initializeDynamo from "../../../src/dynamodb";

jest.setTimeout(60_000);

// Code from BusinessEmailModel.ts

import dynamo from "dynamodb";
import Joi from "joi";
import DynamoModel from "../../../src/utils/model/dynamodb/DynamoModel";
import IDatabaseModel from "../../../src/utils/model/IDatabaseModel";

const BusinessEmail = dynamo.define("BusinessEmail", {
    hashKey: "businessName",
    timestamps: true,
    schema: {
        businessName: Joi.string().min(1).max(250).required(),
        businessEmail: Joi.string().email()
    }
});

class BusinessEmailModel {

    public static async create(businessName: string, businessEmail: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.create(BusinessEmail, "businessName", { businessName, businessEmail });
        } catch (err) {
            throw err;
        }
    }

    public static async doesExist(businessName: string): Promise<boolean> {
        try {
            const potentialBusinessEmailModel = await BusinessEmail.get(businessName);
            return potentialBusinessEmailModel === null ? false : true;
        } catch (err) {
            throw err;
        }
    }

    public static async getExistingModel(businessName: string): Promise<IDatabaseModel> {
        try {
            return await DynamoModel.getExistingModel(BusinessEmail, "businessName", businessName);
        } catch (err) {
            throw err;
        }
    }
}
// end of code from BusinessEmailModel.ts

initializeDynamo();

test("BusinessEmailModel instance is successfully created and saved.", async () => {
    try {
        const businessEmail = await BusinessEmailModel.create("Test Org", "testorg@test.com") as DynamoModel;
        const readBusinessEmail = await BusinessEmailModel.getExistingModel("Test Org") as DynamoModel;
        const hashKeyReadSuccessful = businessEmail.hashKey === readBusinessEmail.hashKey;
        expect(hashKeyReadSuccessful).toBe(true);
    } catch (err) {
        expect(err).toBe("");
    }
});

test("BusinessEmailModel fails to get DynamoModel instance because it does not exist.", async () => {
    try {
        const readBusinessEmail = await BusinessEmailModel.getExistingModel("Nonsense") as DynamoModel;
    } catch (err) {
        expect((err as Error).message).toBe(`There is no such model with a hash key of "Nonsense"`);
    }
});

test("BusinessEmailModel returns true since the model exists", async () => {
    const exists = await BusinessEmailModel.doesExist("Test Org");
    expect(exists).toBe(true);
});

test("BusinessEmailModel returns false since the model does not exist", async () => {
    const exists = await BusinessEmailModel.doesExist("Nonsense");
    expect(exists).toBe(false);
});
