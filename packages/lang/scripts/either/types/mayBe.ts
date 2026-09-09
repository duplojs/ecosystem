import { type None } from "../left";
import { type Some } from "../right";

export type MayBe<GenericValue extends unknown> = (
	| Some<GenericValue>
	| None
);
