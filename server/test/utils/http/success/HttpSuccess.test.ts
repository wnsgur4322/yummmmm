import HttpSuccess from "../../../../src/utils/http/success/HttpSuccess";


test("HttpSuccess returns the appropriate content given the inputs in the constructor.", () => {
    const success = new HttpSuccess(200, "ok");
    expect(success.getContent()).toEqual({
        statusCode: 200,
        status: "success",
        message: "ok"
    });
});

test("HttpSuccess returns the appropriate content given the inputs in the constructor.", () => {
    const success = new HttpSuccess(200);
    expect(success.getContent()).toEqual({
        statusCode: 200,
        status: "success",
        message: "The operation was successful."
    });
});