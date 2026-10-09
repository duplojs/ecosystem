import { SerializedTheDate } from './types';
import * as DKind from '../kind';
declare const TheDate_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangChrono/the-date", unknown>>, DateConstructor>;
export declare class TheDate extends TheDate_base {
    private constructor();
    toNative(): Date;
    toString(): SerializedTheDate;
    toJSON(): SerializedTheDate;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setDate(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setFullYear(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setHours(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setMilliseconds(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setMinutes(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setMonth(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setSeconds(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setTime(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCDate(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCFullYear(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCHours(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCMilliseconds(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCMinutes(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCMonth(): number;
    /**
     * @deprecated this method does not work on ImmutableDate
     */
    setUTCSeconds(): number;
}
export {};
