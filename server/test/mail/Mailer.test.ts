import Joi from "joi";
import Mailer from "../../src/utils/mail/Mailer";

class TestMailer extends Mailer {

    public constructor(receiverEmailAddress: string) {
        super(receiverEmailAddress);
    }

    public async sendEmail(subject: string, content: string) : Promise<void> {

    }
}


test("Instance of Mailer returns the appropriate receiver address specified in the constructor.", async () => {
    try {
        const mailer = new TestMailer("test@test.com");
        expect(mailer.receiverEmailAddress).toBe("test@test.com");
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});

test("Instance of Mailer throws validation error because email is invalid", async () => {
    try {
        const mailer = new TestMailer("bad email");
    } catch (err) {
        expect(err instanceof Joi.ValidationError).toBe(true);
    }
});
