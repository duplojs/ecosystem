import * as DSCommand from "@duplojs/server/command";
import { clientRentBookCommand } from "./clientRentBook";

await DSCommand.exec(
	{
		displayName: "library",
		description: "Manage book rentals",
		subjects: [clientRentBookCommand],
	},
	() => {},
);
