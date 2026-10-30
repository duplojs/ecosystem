import * as DCommon from "@duplojs/lang/common";
import { CompleteTaskFact, type Task } from "../entities/task";

export function completeTask(
	task: Task.Entity & Task.PendingFlag,
) {
	return DCommon.pipe(
		task,
		CompleteTaskFact.run,
	);
}
