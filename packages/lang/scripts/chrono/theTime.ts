import * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import { makeSafeTimeValue } from "./makeSafeTimeValue";
import type { SerializedTheTime } from "./types";
import { serialize } from "./serialize";

const defaultKindValue = {};

export class TheTime extends DKind.parentClass(
	createKind("the-time"),
) {
	private constructor(
		private timeValue: number,
	) {
		super(defaultKindValue);
	}

	public toNative(): number {
		return this.timeValue;
	}

	public override toString(): SerializedTheTime {
		return serialize(this);
	}

	public toJSON(): SerializedTheTime {
		return serialize(this);
	}

	/**
	 * @internal
	 */
	public static "new"(time: number): TheTime {
		return new TheTime(makeSafeTimeValue(time));
	}
}
