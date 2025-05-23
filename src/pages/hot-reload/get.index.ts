export async function handleRequest(req: Request) {
    const url = new URL(req.url);
    const href = url.searchParams.get("href") as string;
    const html = await fetch(href, {
        headers: {
            Cookie: req.headers.get("Cookie") || "",
        },
    });
    const data = {
        href,
        html: await html.text(),
    };

    const message = `id: hot-reload\ndata: ${JSON.stringify(data)}\nretry: 250\n\n`;

    return new Response(message, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
