import { CreateListFact } from "../entities/list/facts";
import type { List } from "../entities/list";

export function createList(
	params: {
		id: List.Id;
		title: List.Title;
	},
) {
	return CreateListFact.run(params);
}
