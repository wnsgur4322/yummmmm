/*
logoutController.ts
Description: Removes the user's json web token from cookies such that they will need to reauthenticate again to access their account.
Use Cases: A user is finished with their session
*/

import { Request, Response, NextFunction } from "express";
import JsonWebToken from "../../utils/auth/tokens/JsonWebToken";
import HttpError from "../../utils/http/error/HttpError";
import HttpSuccess from "../../utils/http/success/HttpSuccess";

/**
 * logoutController just clears the jwt from cookies. Upon receiving a 200 OK response, it is the React app's responsibility
 * to redirect the user to the login page using react router.
 */
const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jsonWebToken = new JsonWebToken();
        jsonWebToken.clearTokenFromCookies(res);
        return new HttpSuccess(200).send(res);
    } catch (err) {
        return next(new HttpError(500, "The server failed to log you out."));
    }
};

export default logoutController;