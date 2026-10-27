import { createPresetChecker } from "@core";
import { testChecker } from "./checker";

export const testPresetChecker = createPresetChecker(
	testChecker,
	{
		result: "info",
		otherwise: ({ response }) => response.notFound("notFound"),
	},
);
