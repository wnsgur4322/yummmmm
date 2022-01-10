import HttpError from "../../../../src/utils/http/error/HttpError";


test("HttpError returns the appropriate content given the inputs in the constructor.", () => {
    const error = new HttpError(400, "bad request");
    expect(error.getContent()).toEqual({
        statusCode: 400,
        status: "error",
        message: "bad request"
    });
});

test("HttpError returns the appropriate content given the inputs in the constructor.", () => {
    const error = new HttpError(400);
    expect(error.getContent()).toEqual({
        statusCode: 400,
        status: "error",
        message: "An error has occurred."
    });
});