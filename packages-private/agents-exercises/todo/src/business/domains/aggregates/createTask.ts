import { CreateTaskFact } from "../entities/task/facts";
import type { List } from "../entities/list";
import type { Task } from "../entities/task";

export function createTask(
	params: {
		list: (List.Entity & List.OpenFlag) | null;
		id: Task.Id;
		title: Task.Title;
	},
) {
	return CreateTaskFact.run({
		id: params.id,
		list: params.list,
		title: params.title,
	});
}
