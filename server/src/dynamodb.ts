/*
dynamodb.ts
Description: This file is used to connect to dynamodb.
Use Cases: initializeDynamo is called in the main method upon starting the server
*/
import dotenv from "dotenv";
dotenv.config();
process.env.AWS_SDK_LOAD_CONFIG="1";
import dynamo from "dynamodb";
import Joi from "joi";

/** Creates the connection with DynamoDB used by the Object-Relational Mapper and the DynamoModels */
const initializeDynamo = () => {
    try {
        const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
        dynamo.AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY, region: AWS_REGION });
        dynamo.createTables(function(err) {
            if (err) {
              // console.log('Error creating tables: ', err);
            } else {
              // console.log('Tables has been created');
            }
        });
        return dynamo;
    } catch (err) {
        throw err;
    }
}

export default initializeDynamo;
