/*
errorRouter.ts
Description: errorRouter is an express middleware function that handles all errors sent by controllers.
Use Cases: redirect errors to the user through a single middleware.
*/

import { Request, Response, NextFunction } from "express";
import HTTPError from "../../utils/http/error/HttpError";

/** All errors in middleware are propogated to this middleware and returned to the client */
const errorRouter = (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const content = err.getContent();
    return res.status(content.statusCode).json(content);
}

export default errorRouter;