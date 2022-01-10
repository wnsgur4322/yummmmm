import AlphanumericCodeGenerator from "../../../src/utils/random-generation/AlphanumericCodeGenerator";

function isAlphanumeric(data: string) {
    for (const c of data) {
        if ((c.charCodeAt(0) < 48 || c.charCodeAt(0) > 57) && (c.charCodeAt(0) < 65 || c.charCodeAt(0) > 90)) {
            return false;
        }
    }
    return true;
}


test("AlphanumericCodeGenerator generates an alphanumeric code of 12 characters successfully", async () => {
    try {
        const generator = new AlphanumericCodeGenerator();
        const code = await generator.generate(12);
        const isExactly12CharactersLongAndAlphanumeric = code.length === 12 && isAlphanumeric(code);
        expect(isExactly12CharactersLongAndAlphanumeric).toBe(true);
    } catch (err) {
        expect(`${err}`).toBe("");
    }
});

test("AlphanumericCodeGenerator encryptedMatchesDecrypted returns false because the decrypted code does not match",
async () => {
    const codeGen = new AlphanumericCodeGenerator();
    const decryptedCode = await codeGen.generate();
    const encryptedCode = await codeGen.asEncrypted(await codeGen.generate());
    expect(await codeGen.compare(encryptedCode, decryptedCode)).toBe(false);
});

test("AlphanumericCodeGenerator encryptedMatchesDecrypted returns true because the decrypted code matches",
async () => {
    const codeGen = new AlphanumericCodeGenerator();
    const decryptedCode = await codeGen.generate();
    const encryptedCode = await codeGen.asEncrypted(decryptedCode);
    expect(await codeGen.compare(encryptedCode, decryptedCode)).toBe(true);
});