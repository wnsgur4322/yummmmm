/*
HttpSuccess.ts
Description: A class for indicating various http successes.
Use Cases: Sending http success codes in controller functions.
*/

import { Response } from "express";
import IHttpResponse from "../IHttpResponse";

export default class HttpSuccess implements IHttpResponse {

    private _statusCode: number;
    private _message: string;

    public constructor(statusCode: number, message: string = "The operation was successful.") {
        this._statusCode = statusCode;
        this._message = message;
    }
    /**
     * @returns the raw object with information about the successful http response
     */
    public getContent() {
        return {
            statusCode: this._statusCode,
            status: "success",
            message: this._message
        };
    }
    /**
     * @param res The express request object 
     * @returns the express request object but effectively ends the middleware pipeline when called by sending the success object
     */
    public send(res: Response) {
        return res.status(this._statusCode).json(this.getContent());
    }
}