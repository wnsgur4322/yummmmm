/*
loginWithAccessCodeController.ts
Description: This controller takes in a business name and an access code and authenticates the user.
Use Cases: Whenever a business user logins in they will utilize this middleware function
*/

import { Request, Response, NextFunction } from "express";
import AccessCodeChecker from "../../model/business-access-codes/AccessCodeChecker";
import AccessCodeValidationError from "../../model/business-access-codes/error/AccessCodeValidationError";
import IAuthToken from "../../utils/auth/tokens/IAuthToken";
import JsonWebToken from "../../utils/auth/tokens/JsonWebToken";
import HttpError from "../../utils/http/error/HttpError";
import HttpSuccess from "../../utils/http/success/HttpSuccess";

/**
 * loginWithAccessCodeController uses the access code submitted by the client in the request body to authenticate the business.
 * Once authenticated, a json web token is generated and sent to the client's cookies.
 */
const loginWithAccessCodeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { businessName, accessCode } = req.body;
        // remove whitespace from accessCode
        accessCode = accessCode.replace(/\s/g, "");
        const accessCodeChecker = new AccessCodeChecker(businessName, accessCode);
        await accessCodeChecker.validate();
        // create the authentication token for the client and add it to cookies
        const webToken: IAuthToken = new JsonWebToken();
        const jwtToken = await webToken.generate(businessName);
        webToken.attachTokenToCookies(res, jwtToken);
        return new HttpSuccess(201, "You have been logged in successfully!").send(res);
    } catch (err) {
        if (err instanceof AccessCodeValidationError) {
            return next(new HttpError(400, err.message));
        }
        return next(new HttpError(500, (err as Error).message));
    }
};

export default loginWithAccessCodeController;