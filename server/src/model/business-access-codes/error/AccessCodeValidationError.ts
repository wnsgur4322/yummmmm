/*
AccessCodeValidationError.ts
Description: Error that is thrown when either the business name does not have a current access code, the access
code is expired, or the access code is wrong.
Use Cases: Business Authentication
*/

export default class AccessCodeValidationError extends Error {
    public constructor(message: string) {
        super(message);
    }
}