/*
logger.ts
Description: This file contains a method meant to be used globally for logging while in development.
Use Cases: logging request types (GET, POST, DELETE, etc...), logging status of network transactions, or logging the value of specific data.
*/


const LOGGER = (data: string): boolean => {
    if (process.env.NODE_ENV === "development") {
        console.log(data);
        return true;
    }
    return false;
};

export default LOGGER;