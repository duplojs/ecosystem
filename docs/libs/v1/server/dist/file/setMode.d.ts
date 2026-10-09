import { FileSystemEither } from './types';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
interface Permissions {
    read?: boolean;
    write?: boolean;
    exec?: boolean;
}
interface ModeObject {
    user?: Permissions;
    group?: Permissions;
    other?: Permissions;
    setUserId?: boolean;
    setGroupId?: boolean;
    sticky?: boolean;
}
type SetMode = ModeObject | number;
export type SetModeResult = FileSystemEither<DEither.Right<"set-mode", void> | DEither.Left<"set-mode-not-found", unknown> | DEither.Left<"set-mode-permission-denied", unknown> | DEither.Left<"set-mode-not-directory", unknown> | DEither.Left<"set-mode-read-only", unknown> | DEither.Left<"set-mode-invalid-argument", unknown> | DEither.Left<"set-mode-error", unknown>>;
declare module '../implementor' {
    interface ServerFunction {
        setMode(path: string & DPath.Path, mode: SetMode): Promise<SetModeResult>;
    }
}
export declare function setMode(mode: SetMode): (path: string & DPath.Path) => Promise<SetModeResult>;
export declare function setMode(path: string & DPath.Path, mode: SetMode): Promise<SetModeResult>;
export {};
