declare module '../implementor' {
    interface ServerFunction {
        getProcessArguments(): string[];
    }
}
export declare const getProcessArguments: () => string[];
