import { type List, type Task, type User } from "../../business/domains";

export const database = {
	task: new Map<string, Task.Entity>(),
	list: new Map<string, List.Entity>(),
	user: new Map<string, User.Entity>(),
};
