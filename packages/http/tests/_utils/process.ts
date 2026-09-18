import { createProcess } from "@core";
import * as DCommon from "@duplojs/lang/common";

export const testProcess = createProcess({
	steps: [],
	options: DCommon.forward<{ test?: boolean }>({ test: true }),
	hooks: [],
	metadata: [],
});
