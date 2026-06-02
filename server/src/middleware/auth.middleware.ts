import * as dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();
export const validatedAccessToken=auth({
    issuerBaseURL:`https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
})