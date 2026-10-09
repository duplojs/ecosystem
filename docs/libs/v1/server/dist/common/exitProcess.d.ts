declare module '../implementor' {
    interface ServerFunction {
        exitProcess(code?: number): void;
    }
}
export declare const exitProcess: (code?: number) => void;
