import dotenv from "dotenv";
dotenv.config();
import initializeDynamo from "../../../src/dynamodb";
import AccessCodeSender from "../../../src/model/business-access-codes/AccessCodeSender";
import BusinessNameDoesNotExistError from "../../../src/model/business-emails/error/BusinessNameDoesNotExistError";
import AlphanumericCodeGenerator from "../../../src/utils/random-generation/AlphanumericCodeGenerator";

jest.setTimeout(60_000);


initializeDynamo();

test("The AccessCodeSender throws a BusinessNameDoesNotExistError instance because the business name provided is invalid",
async () => {
    try {
        const accessCodeSender = new AccessCodeSender("nonsense");
        await accessCodeSender.send();
    } catch (err) {
        expect(err instanceof BusinessNameDoesNotExistError).toBe(true);
    }
});

test("The AccessCodeSender generates the proper decrypted-encrypted code pair", async () => {
    const codeSender = new AccessCodeSender("doesnt matter");
    const [decrypted, encrypted] = await codeSender.getDecryptedEncryptedCodes();
    const codesDoMatch = await new AlphanumericCodeGenerator().compare(encrypted, decrypted);
    expect(codesDoMatch).toBe(true);
});

test("The AccessCodeSender succeeds in sending the access code because the business name is correct.",
async () => {
    try {
        const accessCodeSender = new AccessCodeSender("Test Business");
        await accessCodeSender.send();
        expect(true).toBe(true);
    } catch (err) {
        // purposely make it fail if we get an error
        expect(err instanceof Error).toBe(false);
    }
});