/*
IDatabaseModel.ts
Description: An interface that decouples model logic from the specific model implementation.
Use Cases: Allows the the rest of the application to be agnostic about what database it is using.
*/
import dynamo from "dynamodb";


export default interface IDatabaseModel {

    read(): Promise<Record<string, any>>;
    update(propertyValueRecord: Record<string, any>, updateOptions?: Record<string, any>): Promise<void>;
    delete(): Promise<void>;
    save(): Promise<void>;
}