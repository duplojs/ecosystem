import { createBodyController } from "@core";
import * as DEither from "@duplojs/lang/either";

export function createBodyReader(theFunction: () => unknown = () => undefined) {
	const BodyController = createBodyController("test");
	const bodyController = BodyController.create({});
	const bodyReader = bodyController.createReaderOrThrow(
		BodyController.createReaderImplementation(
			async() => {
				const result = await theFunction();

				if (result instanceof Error) {
					return DEither.left("reader-error", result);
				}

				return DEither.success(result);
			},
		),
	);

	return bodyReader;
}
