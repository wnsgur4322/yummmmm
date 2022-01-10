/*
IAuthorizationMiddleware.ts
Description: An interface for middleware that authorizes users before certain controllers.
Use Cases: Implemented by JwtAuthorizationMiddleware
*/

import { Request, Response, NextFunction } from "express";
import HttpError from "../http/error/HttpError";

export default interface IAuthorizationMiddleware {
    middleware(req: Request, res: Response, next: NextFunction): Promise<HttpError | void>;
}