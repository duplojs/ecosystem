import { CreateListFact } from "../entities/list/facts";
import type { List } from "../entities/list";
import type { User } from "../entities/user";

export function createList(
	params: {
		id: List.Id;
		title: List.Title;
		creator: User.Entity;
	},
) {
	return CreateListFact.run({
		id: params.id,
		title: params.title,
		creator: params.creator,
	});
}
