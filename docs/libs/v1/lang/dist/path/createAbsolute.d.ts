import { Absolute, Path } from './constraints';
import * as DEither from '../either';
export declare function createAbsolute(value: string): (DEither.Success<string & Absolute & Path> | DEither.Error<string>);
