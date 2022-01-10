/*
app.ts
Description: This file contains the class ExpressApp, which encapsulates the basic express method calls to set up the HTTP server.
Use Cases: The ExpressApp class is used to initialize express in the main.ts file upon execution of the main method.
*/

import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import LOGGER from "./logger";
import authRouter from "./router/auth/authRouter";
import errorRouter from "./router/error/errorRouter";
import XSSPreventionMiddleware from "./utils/security/XSSPreventionMiddleware";


export default class ExpressApp {

    private _app: express.Express;
    private _xssPreventionMiddleware: XSSPreventionMiddleware;

    public constructor() {
        this._app = express();
        this._xssPreventionMiddleware = new XSSPreventionMiddleware();
        this.defineMiddlewareForApp();
        this.defineRouters();
        // use the error middleware last
        this.defineErrorMiddleware();
    }
    /**
     * All routers used in the app are defined here
     */
    private defineRouters(): void {
        this._app.use("/auth", authRouter);
    }

    /**
     * Crucial middleware (for example sanitizing data or parsing response data) is defined here
     */
    private defineMiddlewareForApp(): void {
        this._app.use(express.json());
        this._app.use(cookieParser());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(fileUpload());
        this._app.use(this._xssPreventionMiddleware.middleware.bind(this._xssPreventionMiddleware));
    }
    /** defines the error middleware used at the end of the middleware pipeline */
    private defineErrorMiddleware(): void {
        this._app.use(errorRouter);
    }
    /** Starts the express app using all the middleware and routers defined above */
    public async start(): Promise<void> {
        try {
            const PORT: number = parseInt(process.env.PORT || "3080");
            this._app.get("/", (req: Request, res: Response, next: NextFunction) => res.json({ message: `Welcome to ${process.env.APP_NAME}`}));
            this._app.listen(PORT, () => LOGGER(`The server is running on port ${PORT}...`));
        } catch (err) {
            throw err;
        }
    }
}