/*
JwtAuthorizationMiddleware.ts
Description: JwtAuthorizationMiddleware is an implementation of IAuthorizationMiddleware that does a simple validation
check on the json web token submitted in the header of the request. In addition to validating, JwtAuthorizationMiddleware
saves the decoded userId obtained from the json web token on the request object.
Use Cases: blocking an API route for only authenticated users.
*/

import { NextFunction, Request, Response } from "express";
import { json } from "stream/consumers";
import JsonWebToken from "../../../src/utils/auth/tokens/JsonWebToken";
import HttpError from "../http/error/HttpError";
import IAuthorizationMiddleware from "./IAuthorizationMiddleware";
import InvalidAuthTokenError from "./tokens/error/InvalidAuthTokenError";

export default class JwtAuthorizationMiddleware implements IAuthorizationMiddleware {
    /**
     * This middleware method grabs the jwt from the request authorization header, validates, and then decodes the token and
     * saves the user id to the request object and calls the next middleware.
     */
    public async middleware(req: Request, res: Response, next: NextFunction): Promise<HttpError | void> {
        try {
            let jwtFromHeader = req.headers.authorization;
            // get the jwt or raise an error if it does not exist
            if (jwtFromHeader && jwtFromHeader.startsWith("Bearer ")) {
                jwtFromHeader = jwtFromHeader.split(" ")[1];
            } else {
                throw new InvalidAuthTokenError("The current token is invalid or has expired.");
            }
            const jsonWebToken = new JsonWebToken();
            const userId = await jsonWebToken.validateAndDecodeToken(jwtFromHeader);
            // save the userId on the request object for later usage
            (req as any).userId = userId;
            return next();
        } catch (err) {
            if (err instanceof InvalidAuthTokenError) {
                return next(new HttpError(400, err.message));
            } else {
                return next(new HttpError(500, "The server encountered an unexpected error while authenticating the current token."));
            }
        }
    }
}
