/*
MockExpressResponse.ts
Description: a class that impersonates express responses for unit tests
Use Cases: Use this class to unit test controllers
*/

export default class MockExpressResponse {
    status = (code: number) => this;
    json = (content: Record<string, any>) => content;

    private _cookies: Map<string,string> = new Map();

    public constructor() {}

    public cookie(cookieName: string, cookieData: string, cookieOptions: Record<string, any>) {
        this._cookies.set(cookieName, cookieData);
    }

    public clearCookie(cookieName: string) {
        this._cookies.delete(cookieName);
    }

    public hasCookie(cookieName: string) {
        return this._cookies.has(cookieName);
    }
}