/*
XSSPreventionMiddleware.ts
Description: Implements IDataCleansingMiddleware by sanitizing incoming data in the request object that could be exploited for 
XSS attacks.
Use Cases: Every time a request is sent to the server, the necessary data is piped through this middleware and cleaned.
*/

import { Request, Response, NextFunction } from "express";
import xss from "xss";
import IDataCleansingMiddleware from "./IDataCleansingMiddleware";


export default class XSSPreventionMiddleware implements IDataCleansingMiddleware {
    /** Given misc data, `cleanData` replaces all less than and greater than signs with their html escape codes */
    private cleanData(data: string): string { return xss(data).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    /** All data present in the request object's params, body, and cookies is sanitized to prevent XSS attacks */
    public async middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
        // sanitize data in request parameters
        Object.keys(req.params).forEach(key => req.params[key] = this.cleanData(req.params[key]));
        // sanitize data in request body
        Object.keys(req.body).forEach(key => req.body[key] = this.cleanData(req.body[key]));
        // sanitize data in cookies
        Object.keys(req.cookies).forEach(key => req.cookies[key] = this.cleanData(req.cookies[key]));
        return next();
    }
}