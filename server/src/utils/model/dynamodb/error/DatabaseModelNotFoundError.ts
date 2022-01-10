/*
DatabaseModelNotFoundError.ts
Description: This error is meant to be thrown when a database model could not be located given a hash key.
Use Cases: notifies the system that a database model was not found.
*/

export default class DatabaseModelNotFoundError extends Error {

    public constructor(message: string) {
        super(message);
    }
}