/*
createAccessCodeController.ts
Description: Takes in a business name from the request body and sends the business access code to the email of the business
Use Cases: Whenever a business authenticates, they will need to use this route.
*/

import { Request, Response, NextFunction } from "express";
import { isEmpty } from "lodash";
import AccessCodeSender from "../../model/business-access-codes/AccessCodeSender";
import BusinessNameDoesNotExistError from "../../model/business-emails/error/BusinessNameDoesNotExistError";
import HttpError from "../../utils/http/error/HttpError";
import HttpSuccess from "../../utils/http/success/HttpSuccess";

/**
 * createAccessCodeController uses the business name submitted by the client in req.body and sends the access code
 * to the business email.
 */
export const createAccessCodeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const businessName = req.body.businessName;
        if (isEmpty(businessName)) throw new BusinessNameDoesNotExistError("The business name is required to obtain an access code.");
        await new AccessCodeSender(businessName).send();
        return new HttpSuccess(201, "The access code was created and sent to your business email.").send(res);
    } catch (err) {
        if (err instanceof BusinessNameDoesNotExistError) {
            return next(new HttpError(400, err.message));
        }
        return next(new HttpError(500, (err as Error).message));
    }
};