/*
IRandomCodeGenerator
Description: IRandomCodeGenerator is an interface for classes that randomly generate a string of ASCII characters
Use Cases: generating authentication codes, generating tokens for sessions
*/

export default interface IRandomCodeGenerator {
    generate(numChars: number): Promise<string>;
    asEncrypted(decryptedCode: string): Promise<string>;
    compare(encryptedCode: string, decryptedCode: string): Promise<boolean>;
}