import { type None } from "../left";
import { type Some } from "../right";

export type Maybe<GenericValue extends unknown> = (
	| Some<GenericValue>
	| None
);
