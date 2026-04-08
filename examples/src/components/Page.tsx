export function Page({ children }: { children: unknown }) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reactive Component Examples</title>
            </head>
            <body>
                <main className="p-8 space-y-8">
                    <h1 className="text-2xl font-cal">Reactive Component SXO Examples</h1>
                    {children}
                </main>
            </body>
        </html>
    );
}
