/*
IDataCleansingMiddleware.ts
Description: This is an interface that contains an express middleware function signature that is meant to santize incoming data.
Use Cases: Whenever a user posts or uses get parameters, this middleware would call essentially cleansing all data sent in.
*/

import { Request, Response, NextFunction } from "express";
import HttpError from "../http/error/HttpError";

export default interface IDataCleansingMiddleware {
    middleware(req: Request, res: Response, next: NextFunction): Promise<HttpError | void>;
}