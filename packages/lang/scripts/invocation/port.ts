import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import { type Evidence } from "./evidence";

export const portHandlerKind = createKind("port-handler");

export interface PortHandler<
	GenericPort extends unknown = unknown,
> extends DKind.Kind<typeof portHandlerKind> {
	createImplementation(
		implementation: GenericPort
	): (
		& GenericPort
		& Evidence<"implemented-from-port">
	);
}

export function createPort<
	GenericPort extends unknown,
>(): PortHandler<GenericPort> {
	return {
		createImplementation(implementation) {
			return implementation as never;
		},
		[portHandlerKind.runTimeKey]: null,
	} satisfies DKind.Remove<PortHandler> as never;
}
