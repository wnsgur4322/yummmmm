/*
DynamoModel.ts
Description: DynamoModel is a base class for all models that use dynamodb for CRUD operations. It encapsulates common code to enable code
reusability across different models.
Use Cases: Abstracting away complicated details of dynamodb models, implements IDatabaseModel so that later a database can easily be changed
and the application will still function.
*/

import dynamo from "dynamodb";
import IDatabaseModel from "../IDatabaseModel";
import DatabaseModelNotFoundError from "./error/DatabaseModelNotFoundError";


export default class DynamoModel implements IDatabaseModel {
    private _modelInstance: dynamo.Model<any>;
    private _modelType: dynamo.Model<any>;
    // the hash key and hash key property name are immutable and cannot be changed after a model is first created
    /** The unique value used to identify the entry in the database */
    private readonly _hashKey: any;
    /** The name of the actual field used as a hash key */
    private readonly _hashKeyAttrName: string;

    protected constructor(modelInstance: dynamo.Model<any>, modelType: dynamo.Model<any>, hashKeyAttrName: string, modelAttributes: Record<string, any>, fromDatabase: boolean = false) {
        this._modelInstance = (fromDatabase) ? modelInstance : new modelType(modelAttributes);
        this._modelType = modelType;
        this._hashKeyAttrName = hashKeyAttrName;
        this._hashKey = (fromDatabase) ? this._modelInstance.attrs[this._hashKeyAttrName] : modelAttributes[hashKeyAttrName];
    }

    /**
     * @returns All the data of the Dynamo model as a copied object 
     */
    public async read(): Promise<Record<string, any>> {
        try {
            // get a deep copy of the attributes
            return { ...this._modelInstance.attrs };
        } catch (err) {
            throw err;
        }
    }
    /** Deletes the model from the database */
    public async delete(): Promise<void> {
        try {
            await this._modelType.destroy(this._hashKey);
        } catch (err) {
            throw err;
        }
    }
    /** Updates the model with the information passed into the property value record */
    public async update(propertyValueRecord: Record<string, any>, updateOptions?: Record<string, any>): Promise<void> {
        try {
            const hashKeyAndValue: Record<string, any> = {};
            hashKeyAndValue[this._hashKeyAttrName] = this._hashKey;
            const updateObject = { ...propertyValueRecord, ...hashKeyAndValue };
            // retrieve the updated model instance from the database
            this._modelInstance = await this._modelType.update(updateObject, updateOptions);
        } catch (err) {
            throw err;
        }
    }
    /**
     * Static method that creates a new DynamoModel instance using the `modelType` passed into it
     * @param modelType the `dynamo.Model<any>` that acts as an Object-Relational Mapper to the appropriate collection
     * @param hashKeyAttrName The name of the field used as a hash key
     * @param modelAttributes The actual data stored in the model
     * @returns The newly created DynamoModel instance
     */
    public static async create(modelType: dynamo.Model<any>, hashKeyAttrName: string, modelAttributes: Record<string, any>): Promise<IDatabaseModel> {
        try {
            const dynamoModel =  new DynamoModel(modelType, modelType, hashKeyAttrName, modelAttributes) as DynamoModel;
            await dynamoModel.save();
            return dynamoModel;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Static method to get an existing entry and return it as a DynamoModel instance
     * @param modelType the `dynamo.Model<any>` that acts as an Object-Relational Mapper to the appropriate collection
     * @param hashKeyAttrName The name of the field used as a hash key
     * @param hashKey The value of the hash key to search for
     * @returns The created DynamoModel instance with the data from the database
     */
    public static async getExistingModel(modelType: dynamo.Model<any>, hashKeyAttrName: string, hashKey: any): Promise<IDatabaseModel> {
        try {
            const modelInstance = await modelType.get(`${hashKey}`);
            if (modelInstance == null) throw new DatabaseModelNotFoundError(`There is no such model with a hash key of "${hashKey}"`);
            return new DynamoModel(modelInstance, modelType, hashKeyAttrName, {}, true);
        } catch (err) {
           throw err; 
        }
    }
    /** Saves changes to the model to the database. This method must be called to actually propogate changes the server
     * makes to the model to the database. Otherwise, if this method is not called the collection in the database will not reflect
     * the changes.
     */
    public async save(): Promise<void> {
        try {
            await this._modelInstance.save();
        } catch (err) {
            throw err;
        }
    }

    public get hashKeyAttrName() { return this._hashKeyAttrName; }

    public get hashKey() { return this._hashKey; }
}

