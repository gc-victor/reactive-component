export default {
    open: false,
    port: 3000,
    loaders: {
        ".svg": "text",
    },
    build: {
        loader: {
            ".ttf": "file",
            ".woff": "file",
            ".woff2": "file",
        },
    },
    publicPath: "./",
    alias: {
        "@dist": "../../dist",
    },
};
