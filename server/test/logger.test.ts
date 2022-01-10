import dotenv from "dotenv";
dotenv.config();
import LOGGER from "../src/logger";

test("LOGGER returns true because it is in development mode", () => {
    process.env.NODE_ENV = "development";
    expect(LOGGER("hello")).toBe(true);
});

test("LOGGER returns false because it is in production mode", () => {
    process.env.NODE_ENV = "production";
    expect(LOGGER("hello")).toBe(false);
});