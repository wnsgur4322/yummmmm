/*
IAuthToken.ts
Description: IAuthToken provides an interface for generating and validating authorization tokens. It makes little assumptions
about the implementation of itself.
Use Cases: The JsonWebToken class implements this interface and is used in the controllers
*/

import { Response } from "express";


export default interface IAuthToken {
    generate(id: string, secretKey?: string, expiresIn?: number): Promise<string>;
    attachTokenToCookies(res: Response, token: string, tokenName?: string, cookieOptions?: Record<string, any>): void;
    clearTokenFromCookies(res: Response, tokenName?: string): void;
    validateAndDecodeToken(token: string, secretKey?: string): Promise<string>;
}