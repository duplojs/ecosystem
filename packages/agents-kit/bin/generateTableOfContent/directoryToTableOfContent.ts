import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DInvocation from "@duplojs/lang/invocation";
import * as DPath from "@duplojs/lang/path";
import * as DPattern from "@duplojs/lang/pattern";
import * as DString from "@duplojs/lang/string";
import * as DSFile from "@duplojs/server/file";

interface DirectoryToTableOfContentParams {
	inputPathFolder: string & DPath.Path & DPath.Absolute;
	outputPathFolderFile: string & DPath.Absolute;
	isIgnore: DPath.PathMatcher;
}

export const directoryToTableOfContent: (params: DirectoryToTableOfContentParams) => Promise<
	| Extract<DSFile.WalkDirectoryResult | DSFile.ReadTextFileResult, DEither.Left>
	| DEither.Right<"render-success", string>
> = DInvocation.flow(
	({ inputPathFolder }) => DSFile.walkDirectory(inputPathFolder),
	DInvocation.filter(
		DEither.whenHasInformation("file-system-walk-directory", DCommon.forward),
	),
	(entries, { isIgnore }) => DGenerator.filter(
		entries,
		(entry) => !isIgnore(entry.path),
	),
	DGenerator.group(
		DCommon.innerPipe(
			DPattern.when(DSFile.isFolderInterface, DArray.groupOutput("folders")),
			DPattern.when(
				DSFile.isFileInterface,
				(file) => {
					if (file.getName() === "index.md") {
						return DArray.groupOutput("indexes", file);
					}

					return DString.test(file.getName() ?? "", /(?:^|\.)llms\.md$/i)
						? DArray.groupOutput("summaries", file)
						: DArray.groupOutput("other", file);
				},
			),
			DPattern.otherwise(DArray.groupOutput("other")),
		),
	),
	async(entries, params) => {
		const children = await DGenerator.asyncReduce(
			entries.folders ?? [],
			DGenerator.reduceFrom<readonly string[]>([]),
			async({ item, lastValue, next, nextPush, exit }) => {
				const result = await directoryToTableOfContent({
					...params,
					inputPathFolder: item.path,
				});
				if (DEither.isLeft(result)) {
					return exit(result);
				}

				const content = DEither.unwrapRight(result);
				return content ? nextPush(lastValue, content) : next(lastValue);
			},
		);
		if (DEither.isLeft(children)) {
			return children;
		}

		const index = DArray.first(entries.indexes ?? []);
		const summary = DArray.first(entries.summaries ?? []);

		return DEither.rightAsyncPipe(
			index ? DSFile.readTextFile(index.path) : DEither.success(""),
			DString.split(/^---[\t ]*\r?$/m),
			DArray.first,
			DString.trimEnd,
			(content) => summary
				? DString.replace(
					content,
					/^(?<hashtag>#{1,6})[\t ]+(?<title>[^\r\n]+?)(?:[\t ]+#+)?[\t ]*\r?$/gm,
					({ namedGroups }) => `${namedGroups.hashtag} [${namedGroups.title}](${DPath.computeRelative(params.outputPathFolderFile, summary.path)})`,
				)
				: content,
			DArray.coalescing,
			DArray.concat(children),
			DArray.filter(DString.isNotEmpty),
			DString.join("\n\n"),
			(content) => DEither.right("render-success", content),
		);
	},
);
