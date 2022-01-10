import BasicMailer from "../../src/utils/mail/BasicMailer";

jest.setTimeout(60_000);

test("BasicMailer successfully sends an email to the specified email address", async () => {
    try {
        const basicMailer = new BasicMailer("caleb.c.bender@gmail.com");
        await basicMailer.sendEmail("test", "This is a test!");
        
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});