import { CreateTaskFact } from "../entities/task/facts";
import type { List } from "../entities/list";
import type { Task } from "../entities/task";
import type { User } from "../entities/user";

export function createTask(
	params: {
		list: (List.Entity & List.OpenFlag) | null;
		id: Task.Id;
		title: Task.Title;
		creator: User.Entity;
	},
) {
	return CreateTaskFact.run({
		id: params.id,
		list: params.list,
		title: params.title,
		creator: params.creator,
	});
}
