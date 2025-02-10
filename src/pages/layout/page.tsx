import { assetPath } from "@/pages/lib/asset-path";
import { HotReload } from "@/pages/hot-reload/hot-reload";

interface PageProps {
    href: string;
    children?: ComponentChildren;
}

const scripts = [
    {
        type: "module",
        src: "dist/index.island.js",
    }
];

const title = "Reactive Components";

export function Page({ children, href }: PageProps) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html" />
                <title>{title}</title>
                <link rel="stylesheet" href={assetPath("dist/styles.css")} />
                {scripts ? scripts.map(({ src, ...rest }) => <script src={assetPath(src)} {...rest} />) : ""}
            </head>
            <body class="bg-white text-slate-900">
                <div class="flex items-start gap-x-12 mx-auto max-w-7xl">
                    <div class="container pl-6 pr-2 max-h-[calc(100dvh-(--spacing(1)))] md:pl-0 md:pr-12">
                        <main class="min-w-0 flex-1 gap-x-12 pb-16 pt-8 space-y-12 lg:pt-12">
                            <h1 className="font-cal text-4xl">{title}</h1>
                            {children}
                        </main>
                    </div>
                </div>
                <HotReload href={href} />
            </body>
        </html>
    );
}
