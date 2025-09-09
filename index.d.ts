/// <reference lib="dom" />

declare global {
    const process: {
        env: {
            [key: string]: string | undefined;
        };
    };

    namespace JSX {
        interface Element {
            type: string;
            props: { [key: string]: unknown };
            children: unknown[];
        }

        interface IntrinsicElements {
            [elemName: string]: unknown;
        }
    }
    type ComponentChild = object | string | number | bigint | boolean | null | undefined | JSX.Element;
    type ComponentChildren = ComponentChild[] | ComponentChild;
    const Fragment: (props: JSX.Fragment) => ComponentChildren;
    const StringHTML: (input: string) => string;

    export type TestFunction = () => void;
    export type TestSuite = (name: string, fn: () => void) => void;

    interface SpyStats<ReturnValue = unknown, Arguments = unknown> {
        callCount: number;
        called: boolean;
        calls: Arguments[];
        returnValue: ReturnValue;
    }

    interface ExpectationMatchers<T = unknown> {
        toBe(expected: T): void;
        toEqual(expected: T): void;
        toDeepEqual(expected: T): void;
        toBeTruthy(): void;
        toBeFalsy(): void;
        toContain(item: unknown): void;
        toThrow(): boolean;
    }

    interface Window {
        ReactiveComponent: typeof ReactiveComponent;
    }
}

export type {};
