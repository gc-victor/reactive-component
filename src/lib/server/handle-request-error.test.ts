import { ValiError } from "valibot";

import { describe, expect, test } from "query:test";
import { OAuth2CreadentialsError, OAuth2Error } from "@/lib/server/oauth2";
import { handleRequestError } from "@/lib/server/handle-request-error";
import { ResponseError } from "./response-error";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "./status";

describe("handleRequestError correctly handles various error types", () => {
    describe("ResponseError", () => {
        test("with cause containing message and status", async () => {
            const error = new ResponseError("Test error", 400);
            const response = handleRequestError(error);
            expect(response.status).toBe(400);
            expect(await response.text()).toBe("Test error");
        });

        test("without cause details", async () => {
            const error = new ResponseError("", 500);
            const response = handleRequestError(error);
            expect(response.status).toBe(500);
            expect(await response.text()).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
        });
    });

    describe("ValiError", () => {
        test("with validation issues", async () => {
            const error = new ValiError([
                {
                    message: "Field required",
                    path: [{ type: "unknown", origin: "value", input: "field", key: "field", value: null }],
                    kind: "validation",
                    type: "type",
                    input: "field",
                    expected: "string",
                    received: "null",
                },
            ]);
            const response = handleRequestError(error);
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({ errors: { field: "Field required" } });
        });
    });

    describe("OAuth2CreadentialsError", () => {
        test("returns internal server error", async () => {
            const error = new OAuth2CreadentialsError("AdapterName");
            const response = handleRequestError(error);
            expect(response.status).toBe(500);
            expect(await response.text()).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
        });
    });

    describe("OAuth2Error", () => {
        test("with code and description", async () => {
            const error = new OAuth2Error("invalid_token", "Token expired");
            const response = handleRequestError(error);
            expect(response.status).toBe(401);
            expect(response.headers.get("content-type")).toBe("application/json");
            expect(await response.json()).toEqual({
                error: "invalid_token",
                error_description: "Token expired",
            });
        });
    });

    describe("Generic Error", () => {
        test("returns bad request with error message", async () => {
            const error = new Error("Generic error");
            const response = handleRequestError(error);
            expect(response.status).toBe(400);
            expect(await response.text()).toBe("Generic error");
        });
    });
});
