// Provide permissive JSX namespace for TSX usage without React/Preact types.
// This enables TSX without tying to React/Preact and avoids attribute type errors.
declare namespace JSX {
    // Use unknown instead of any for maximum permissiveness without 'any'
    type Element = unknown;
    type ElementClass = object;
    interface ElementAttributesProperty {
        props: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
        children: unknown;
    }
    interface IntrinsicAttributes {
        id?: string;
        class?: string;
        className?: string;
        style?: string | Record<string, unknown>;
        // Allow any other attribute (aria-*, data-*, etc.)
        [attr: string]: unknown;
    }
    interface IntrinsicClassAttributes {
        ref?: unknown;
    }
    // Provide explicit common elements plus a permissive catch-all.
    interface IntrinsicElements {
        // Custom elements and any fallback
        [elemName: string]: Record<string, unknown>;
    }
}
