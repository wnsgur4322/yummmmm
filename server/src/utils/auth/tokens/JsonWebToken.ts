/*
JsonWebToken.ts
Description: An implementation of IAuthToken.ts that allows easy use of JWTs
Use Cases: Used in controllers that involve user authentication
*/
import dotenv from "dotenv";
dotenv.config();
import IAuthToken from "./IAuthToken";
import jwt from "jsonwebtoken";
import { Response } from "express";
import InvalidAuthTokenError from "./error/InvalidAuthTokenError";
/** JWT_TOKEN_NAME is the name that will appear on the jwt cookie in the browser
 * JWT_SECRET_KEY is the default secret key used in the token creation
 * JWT_EXPIRATION is the time in seconds until the jwt will expire
*/
const { JWT_TOKEN_NAME, JWT_SECRET_KEY, JWT_EXPIRATION } = process.env;

export default class JsonWebToken implements IAuthToken {

    private static tokenName: string = JWT_TOKEN_NAME as string;
    private static secretKey: string = JWT_SECRET_KEY as string;
    private static expirationTime: number = parseInt(JWT_EXPIRATION as string);
    private static defaultTokenCookieOptions: Record<string,any> = {
        expires: new Date(Date.now() + this.expirationTime*1000)
    };
    /**
     * @param id the unique field used as the id for the jwt
     * @param secretKey the secret key used for the hashing of the token
     * @param expiresIn the time until it expires in seconds
     * @returns the created jwt as a string
     */
    public async generate(id: string, secretKey: string = JsonWebToken.secretKey, expiresIn: number = JsonWebToken.expirationTime): Promise<string> {
        try {
            const token =
            await jwt.sign({ id }, secretKey, { expiresIn });
            return token;
        } catch (err) {
            throw err;
        }
    }
    /**
     * @param res the express Response object to attach the token to on its cookies
     * @param token the token to attach to cookies
     * @param tokenName the name of the token that will be visible in tokens
     * @param cookieOptions options for the cookie like if it's HTTP-only or secure
     * @returns void since it adds the jwt as a cookie to `res`
     */
    public attachTokenToCookies(res: Response, token: string, tokenName: string = JsonWebToken.tokenName, cookieOptions: Record<string, any> = JsonWebToken.defaultTokenCookieOptions) {
        res.cookie(tokenName, token, cookieOptions);
    }
    /**
     * @param res the express Response object to remove the token from
     * @param tokenName the name of the token to remove
     * @returns void since it removes the jwt from the cookies
     */
    public clearTokenFromCookies(res: Response, tokenName: string = JsonWebToken.tokenName) {
        res.clearCookie(tokenName);
    }
    /**
     * @param token the jwt to validate
     * @param secretKey the secret key used to validate `token`
     * @returns the original id used to create the token
     */
    public async validateAndDecodeToken(token: string, secretKey: string = JsonWebToken.secretKey): Promise<string> {
        try {
            const decodedToken = await jwt.verify(token, secretKey);
            if (typeof decodedToken === "string") return decodedToken;
            else return decodedToken.id;
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
                throw new InvalidAuthTokenError("The current token is invalid or has expired.");
            }
            throw err;
        }
    }
}