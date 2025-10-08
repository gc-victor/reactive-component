// Main entry point that exports both ReactiveComponent and define

export {
    type Bind,
    type Context as DefineContext,
    type Definition,
    type DefinitionReturn,
    define,
    type Element,
    type LifecycleMethods,
    type State,
} from "./define.js";
export { type Context, createContext, ReactiveComponent, type StateValue } from "./rc.js";
