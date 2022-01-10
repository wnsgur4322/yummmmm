/*
BusinessNameDoesNotExistError.ts
Description: This error informs the system that the business name specified does not exist in the database.
Use Cases: Inform the business user that their business name that was specified is incorrect
*/

export default class BusinessNameDoesNotExistError extends Error {
    public constructor(message: string) {
        super(message);
    }
}