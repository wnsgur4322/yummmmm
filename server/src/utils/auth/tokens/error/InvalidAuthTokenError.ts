/*
InvalidAuthTokenError.ts
Description: InvalidAuthTokenError is used when an authentication token has either expired or is not valid.
Use Cases: user token is invalid or has expired
*/
export default class InvalidAuthTokenError extends Error {
    public constructor(message: string) {
        super(message);
    }
}