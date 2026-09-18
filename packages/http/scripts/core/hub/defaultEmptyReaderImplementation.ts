import * as DEither from "@duplojs/lang/either";
import { EmptyBodyController } from "@core/request";

export const defaultEmptyReaderImplementation = EmptyBodyController.createReaderImplementation(
	() => Promise.resolve(
		DEither.success(undefined),
	),
);
