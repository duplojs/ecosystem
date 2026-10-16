import * as DSCommand from "@duplojs/server/command";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";

export const previewCommand = DSCommand.create(
	"preview",
	{
		description: "Preview export parameters without writing files",
		subjects: [
			DSCommand.createArgument("source", DDataStructure.string()),
			DSCommand.createArgument("destination", DDataStructure.string(), { optional: true }),
		],
		options: [
			DSCommand.createOption("format", DDataStructure.literal(["json", "text"]), {
				required: true,
				aliases: ["f"],
				description: "Export format",
			}),
			DSCommand.createOption("limit", DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.greaterThanOrEqual(1),
				DDataStructure.lessThanOrEqual(100),
			]), { description: "Maximum number of entries" }),
			DSCommand.createBooleanOption("overwrite", { description: "Allow replacement" }),
			DSCommand.createArrayOption("include", DDataStructure.string(), {
				required: true,
				min: 1,
				max: 5,
				description: "Comma-separated entries to include",
			}),
		],
	},
	({ args, options }) => {
		type _CheckArgs = DCommon.ExpectType<
			typeof args,
			{
				readonly source: string;
				readonly destination: string | undefined;
			},
			"strict"
		>;
		type _CheckFormat = DCommon.ExpectType<typeof options.format, "json" | "text", "strict">;
		type _CheckFlag = DCommon.ExpectType<typeof options.overwrite, boolean, "strict">;

		// La liste obligatoire et son minimum garantissent l'accès sans absence.
		const firstEntry = DArray.first(options.include);
		type _CheckFirstEntry = DCommon.ExpectType<typeof firstEntry, string, "strict">;

		console.log({
			...args,
			...options,
			limit: options.limit ?? 20,
			firstEntry,
		});
	},
);
