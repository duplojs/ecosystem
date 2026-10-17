import { Path, Segment } from './constraints';
import * as DEither from '../either';
export declare function createSegment(value: string): (DEither.Success<string & Segment & Path> | DEither.Error<string>);
