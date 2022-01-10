/*
HttpError.ts
Description: Generic http error for creating derivations to abstract http errors sent to the client
Use Cases: sending http errors from controller functions
*/

import IHttpResponse from "../IHttpResponse";

export default class HttpError extends Error implements IHttpResponse {

    private _statusCode: number;

    public constructor(statusCode: number, message: string = "An error has occurred.") {
        super(message);
        this._statusCode = statusCode;
    }
    /**
     * @returns the raw object with information about the error
     */
    public getContent() {
        return {
            statusCode: this._statusCode,
            status: "error",
            message: this.message
        }
    }
}