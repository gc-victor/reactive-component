import { ValiError, flatten } from "valibot";

import { OAuth2CreadentialsError, OAuth2Error } from "@/lib/server/oauth2";
import { ResponseError } from "./response-error";
import {
    BAD_REQUEST_CODE,
    INTERNAL_SERVER_ERROR_CODE,
    INTERNAL_SERVER_ERROR_MESSAGE,
    UNAUTHORIZED_CODE,
} from "./status";

export function handleRequestError(e: Error): Response {
    console.error(e);

    if (e instanceof ResponseError) {
        const error = e as ResponseError;

        return new Response(String(error?.cause?.message) || INTERNAL_SERVER_ERROR_MESSAGE, {
            status: Number(error?.cause?.status) || INTERNAL_SERVER_ERROR_CODE,
        });
    }

    if (e instanceof ValiError) {
        return new Response(JSON.stringify({ errors: flatten(e.issues).nested }), {
            status: BAD_REQUEST_CODE,
        });
    }

    if (e instanceof OAuth2CreadentialsError) {
        return new Response(INTERNAL_SERVER_ERROR_MESSAGE, {
            status: INTERNAL_SERVER_ERROR_CODE,
        });
    }

    if (e instanceof OAuth2Error) {
        return new Response(
            JSON.stringify({
                error: e.code,
                error_description: e.description,
            }),
            {
                status: UNAUTHORIZED_CODE,
                headers: {
                    "content-type": "application/json",
                },
            },
        );
    }

    return new Response(e.message, {
        status: BAD_REQUEST_CODE,
    });
}
