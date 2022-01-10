/*
main.ts
Description: This is the entry point of the web application. The Express App is launched in the main method.
Use Cases: This file is only used for the main application entry point.
*/

import dotenv from "dotenv";
dotenv.config();
import ExpressApp from "./app";
import initializeDynamo from "./dynamodb";
import LOGGER from "./logger";

const main = async (): Promise<void> => {
    try {
        const expressApp = new ExpressApp();
        initializeDynamo();
        await expressApp.start();
    } catch (err) {
        LOGGER(`${err}`);
    }
};

main()
.then()
.catch();

