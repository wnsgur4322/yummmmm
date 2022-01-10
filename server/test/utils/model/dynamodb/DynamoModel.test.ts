import dotenv from "dotenv";
dotenv.config();
import dynamo from "dynamodb";
import Joi from "joi";

import initializeDynamo from "../../../../src/dynamodb";
import DynamoModel from "../../../../src/utils/model/dynamodb/DynamoModel";

jest.setTimeout(60_000);


const TestModel = dynamo.define("TestModel", {
    hashKey: "email",
    timestamps: true,
    schema: {
        email: Joi.string().email(),
        name: Joi.string()
    }
});

initializeDynamo();

const createOrUpdateExistingModel = async (email: string, name: string) => {
    try {
        const model = await DynamoModel.create(TestModel, "email", { email, name });
        return "no error";
    } catch (err) {
        return `${err}`;
    }
};

test("DynamoModel instance based on TestModel creates and saves successfully.", async () => {
    const result = await createOrUpdateExistingModel("john.doe@gmail.com", "John Doe");
    expect(result).toBe("no error");
});

test("DynamoModel instance returns an error message because the email was invalid.", async () => {
    const result = await createOrUpdateExistingModel("@invalid-email", "Some Name");
    expect(result).toBe("ValidationError: \"email\" must be a valid email");
});

test("DynamoModel instance that was created has the correct hashKey and hashKeyAttrName.", async () => {
    const result = (await DynamoModel.create(TestModel, "email", { email: "john.doe@gmail.com", name: "John Doe" }) as DynamoModel);
    const condition = result.hashKeyAttrName === "email" && result.hashKey === "john.doe@gmail.com";
    expect(condition).toBe(true);
});

test("DynamoModel instance that was read has the correct hashKey and hashKeyAttrName.", async () => {
    const result = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com") as DynamoModel;
    const condition = result.hashKeyAttrName === "email" && result.hashKey === "john.doe@gmail.com";
    expect(condition).toBe(true);
});

test("DynamoModel throws an error because there is no hash key with the value specified.", async () => {
    try {
        const result = await DynamoModel.getExistingModel(TestModel, "email", "jane.doe@gmail.com");
    } catch (err) {
        expect((err as Error).message).toBe(`There is no such model with a hash key of "jane.doe@gmail.com"`);   
    }
});

test("DynamoModel successfully retrieves the data and the data is accurate.", async () => {
    try {
        const result = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com");
        const data = await result.read();
        const condition = data["email"] === "john.doe@gmail.com" && data["name"] === "John Doe";
        expect(condition).toBe(true);
    } catch (err) {

    }
});

test("DynamoModel successfully updated the data in the database.", async () => {
    try {
        const result = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com");
        await result.update({ name: "Jelly Bean" });
        const resultFromDB = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com");
        const data = await resultFromDB.read();
        expect(data["name"] === "Jelly Bean").toBe(true);
    } catch (err) {
        
    }
});

test("DynamoModel successfully deleted from the database so that getting the model fails.", async () => {
    try {
        const result = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com");
        await result.delete();
        const resultFromDB = await DynamoModel.getExistingModel(TestModel, "email", "john.doe@gmail.com");
    } catch (err) {
        expect((err as Error).message).toBe(`There is no such model with a hash key of "john.doe@gmail.com"`);
    }
});