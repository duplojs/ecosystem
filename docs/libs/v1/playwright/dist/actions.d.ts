import { Locator as PlaywrightLocator } from 'playwright/test';
export declare namespace Actions {
    const click: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const forceClick: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const hover: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const focus: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const fill: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, content: string) => Promise<any>;
    const type: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, text: string, options?: {
        delay?: number;
        noWaitAfter?: boolean;
        signal?: AbortSignal;
        timeout?: number;
    } | undefined) => Promise<any>;
    const clear: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const press: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, key: string) => Promise<any>;
    const check: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const uncheck: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const selectOption: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, values: string | import("playwright-core").ElementHandle<Node> | readonly string[] | {
        value?: string;
        label?: string;
        index?: number;
    } | readonly import("playwright-core").ElementHandle<Node>[] | readonly {
        value?: string;
        label?: string;
        index?: number;
    }[] | null) => Promise<any>;
    const dragTo: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, target: PlaywrightLocator, options?: {
        force?: boolean;
        noWaitAfter?: boolean;
        scroll?: "auto" | "none";
        signal?: AbortSignal;
        sourcePosition?: {
            x: number;
            y: number;
        };
        steps?: number;
        targetPosition?: {
            x: number;
            y: number;
        };
        timeout?: number;
        trial?: boolean;
    } | undefined) => Promise<any>;
    const extractContent: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    const withStep: (stepName: string) => {
        click: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        forceClick: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        hover: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        focus: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        fill: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, content: string) => Promise<any>;
        type: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, text: string, options?: {
            delay?: number;
            noWaitAfter?: boolean;
            signal?: AbortSignal;
            timeout?: number;
        } | undefined) => Promise<any>;
        clear: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        press: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, key: string) => Promise<any>;
        check: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        uncheck: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
        selectOption: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, values: string | import("playwright-core").ElementHandle<Node> | readonly string[] | {
            value?: string;
            label?: string;
            index?: number;
        } | readonly import("playwright-core").ElementHandle<Node>[] | readonly {
            value?: string;
            label?: string;
            index?: number;
        }[] | null) => Promise<any>;
        dragTo: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey, target: PlaywrightLocator, options?: {
            force?: boolean;
            noWaitAfter?: boolean;
            scroll?: "auto" | "none";
            signal?: AbortSignal;
            sourcePosition?: {
                x: number;
                y: number;
            };
            steps?: number;
            targetPosition?: {
                x: number;
                y: number;
            };
            timeout?: number;
            trial?: boolean;
        } | undefined) => Promise<any>;
        extractContent: <GenericComponent extends import("./component").Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends Extract<keyof GenericComponent["elements"], string> | import("./componentInteraction").ElementsSelector<Extract<keyof GenericComponent["elements"], string>>>(component: GenericComponent, elementSelector: GenericElementKey) => Promise<any>;
    };
}
