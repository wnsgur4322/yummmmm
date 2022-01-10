import { createAccessCodeController } from "../../../src/controller/auth/createAccessCodeController";
import { mockExpressNext } from "../mockExpressNextFunction";
import MockExpressResponse from "../MockExpressResponse";

jest.setTimeout(60_000);

test("The createAccessCodeController sends an error because the business name was not defined", async () => {
    const responseFromServer =
    await createAccessCodeController(
        { body: { businessName: "" }} as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The business name is required to obtain an access code."
    });
});

test("The createAccessCodeController sends an error because the business name was not defined", async () => {
    const responseFromServer =
    await createAccessCodeController(
        { body: { }} as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: "The business name is required to obtain an access code."
    });
});

test("The createAccessCodeController sends an error because the business name does not exist", async () => {
    const responseFromServer =
    await createAccessCodeController(
        { body: { businessName: "nonsense" }} as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 400,
        status: "error",
        message: `The business name "nonsense" is not a registered business.`
    });
});

test("The createAccessCodeController sends a success message because the business name exists", async () => {
    const responseFromServer =
    await createAccessCodeController(
        { body: { businessName: "Test Business" }} as any,
        new MockExpressResponse() as any,
        mockExpressNext as any
    );
    expect(responseFromServer).toEqual({
        statusCode: 201,
        status: "success",
        message: "The access code was created and sent to your business email."
    });
});