import { request } from "express";
import errorRouter from "../../../src/router/error/errorRouter";
import HttpError from "../../../src/utils/http/error/HttpError";
import MockExpressResponse from "../../controller/MockExpressResponse";


test("errorRouter returns the correct content given the HttpError instance", () => {
    const errorContent = errorRouter(new HttpError(500, "Internal server error."), request, new MockExpressResponse() as any, () => null);
    expect(errorContent).toEqual({
        statusCode: 500,
        status: "error",
        message: "Internal server error."
    });
});