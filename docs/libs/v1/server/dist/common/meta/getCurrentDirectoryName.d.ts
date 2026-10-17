import * as DPath from "@duplojs/lang/path";
declare module '../../implementor' {
    interface ServerFunction {
        getCurrentDirectoryName(importMeta: ImportMeta): string & DPath.Absolute;
    }
}
export declare const getCurrentDirectoryName: (importMeta: ImportMeta) => string & DPath.Absolute;
