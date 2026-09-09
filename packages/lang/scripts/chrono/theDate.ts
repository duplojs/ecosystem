import * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type { SerializedTheDate } from "./types";
import { makeSafeTimestamp } from "./makeSafeTimestamp";
import { serialize } from "./serialize";

const defaultKindValue = {};

export class TheDate extends DKind.parentClass(
	createKind("the-date"),
	Date,
) {
	private constructor(timestamp: number) {
		super(defaultKindValue, timestamp);
	}

	public toNative(): Date {
		return new Date(this.getTime());
	}

	public override toString(): SerializedTheDate {
		return serialize(this);
	}

	public override toJSON(): SerializedTheDate {
		return serialize(this);
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setDate(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setFullYear(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setHours(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setMilliseconds(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setMinutes(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setMonth(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setSeconds(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setTime(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCDate(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCFullYear(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCHours(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCMilliseconds(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCMinutes(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCMonth(): number {
		return this.getTime();
	}

	/**
	 * @deprecated this method does not work on ImmutableDate
	 */
	public override setUTCSeconds(): number {
		return this.getTime();
	}

	/**
	 * @internal
	 */
	public static "new"(timestamp: number): TheDate {
		return new TheDate(makeSafeTimestamp(timestamp));
	}
}
