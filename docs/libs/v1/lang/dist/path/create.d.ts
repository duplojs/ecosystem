import { Path } from './constraints';
import * as DEither from '../either';
export declare function create(value: string): (DEither.Success<string & Path> | DEither.Left<"create-path-error", string>);
