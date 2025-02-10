type RequestHandler = (req: Request) => Promise<Response>;
type HandleRequestError = (e: Error) => Response;

export function withHtmlRequestErrorHandler(handler: RequestHandler, handleRequestError: HandleRequestError): RequestHandler {
    return async (req: Request): Promise<Response> => {
        try {
            return await handler(req);
        } catch (e) {
            console.error("Error:", e)
            return handleRequestError(e as Error);
        }
    };
}
