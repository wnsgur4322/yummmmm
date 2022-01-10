/*
authRouter.ts
Description: authRouter contains API routes for business users to authenticate with.
Use Cases: Every time a business authenticates it will use this router.
*/

import express from "express";
import { createAccessCodeController } from "../../controller/auth/createAccessCodeController";
import loginWithAccessCodeController from "../../controller/auth/loginWithAccessCodeController";
import logoutController from "../../controller/auth/logoutController";
const authRouter = express.Router();
/** Route for requesting a freshly created access code */
authRouter.post("/create-access-code", createAccessCodeController);
/** Route for logging in with decrypted access code */
authRouter.post("/login-with-access-code", loginWithAccessCodeController);
/** Route for clearing jwt from cookies and hence logging out */
authRouter.delete("/logout", logoutController);

export default authRouter;