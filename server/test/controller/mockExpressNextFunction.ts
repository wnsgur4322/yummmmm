import { NextFunction, Request, Response } from "express";
import errorRouter from "../../src/router/error/errorRouter";
import HttpError from "../../src/utils/http/error/HttpError";
import MockExpressResponse from "./MockExpressResponse";


export const mockExpressNext =
(err: HttpError) => errorRouter(err, {} as any, new MockExpressResponse() as any, () => null);