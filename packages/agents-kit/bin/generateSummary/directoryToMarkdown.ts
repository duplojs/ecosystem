import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";
import * as DPattern from "@duplojs/lang/pattern";
import * as DPath from "@duplojs/lang/path";

const headings = [
	"#",
	"##",
	"###",
	"####",
	"#####",
	"######",
];
const markdownSeparator = /^---[\t ]*\r?$/m;
const markdownHeading = /^(?<hashtag>#{1,6})[\t ]+(?<title>[^\r\n]+)$/m;
const headingPrefix = /^#{1,6}(?=[\t ])/m;
const indexHeadingPattern = /^(?<heading>#{1,6})[\t ]/m;

export class HeadingLevelExceededError extends DCommon.DuploJSError.parentClass("agents-kit-summary-heading-level-exceeded") {}

function renderHeading(level: number, inputPathFolder: DPath.AnyPath) {
	const heading = level > 0 ? DArray.at(headings, level - 1) : undefined;

	if (!heading) {
		throw new HeadingLevelExceededError(`Cannot generate a heading below level 6 in ${inputPathFolder}`);
	}

	return heading;
}

export const directoryToMarkdown: (
	params: {
		inputPathFolder: string & DPath.Absolute;
		outputPathFolderFile: string & DPath.Absolute;
		isIgnore: DPath.PathMatcher;
		headingLevel?: number;
	},
) => Promise<
	| DEither.Left<"file-system-walk-directory-error", DSFile.WalkDirectoryErrors>
	| DEither.Right<"render-success", string>
> = DInvocation.flow(
	({ inputPathFolder }) => DSFile.walkDirectory(DCommon.cast(inputPathFolder)),
	DInvocation.filter(
		DEither.whenHasInformation(
			"file-system-walk-directory",
			DCommon.forward,
		),
	),
	(entries, { isIgnore }) => DGenerator.filter(entries, (entry) => !isIgnore(entry.path)),
	DGenerator.group(
		DCommon.innerPipe(
			DPattern.when(
				DSFile.isFolderInterface,
				DArray.groupOutput("folders"),
			),
			DPattern.when(
				DSFile.isFileInterface,
				(file) => {
					if (file.getExtension() !== "md") {
						return DArray.groupOutput("examples", file);
					}

					return file.getName() === "index.md"
						? DArray.groupOutput("indexes", file)
						: DArray.groupOutput("markdowns", file);
				},
			),
			DPattern.otherwise(DArray.groupOutput("other")),
		),
	),
	async(
		entryGroupe,
		argument,
	) => {
		const rawIndexContent = DCommon.pipe(
			await DEither.rightAsyncPipe(
				entryGroupe.indexes,
				DEither.toMaybe,
				DArray.first,
				(file) => DEither.rightAsyncPipe(
					DSFile.readTextFile(file.path),
					(content) => {
						const sections = DString.split(content, markdownSeparator);
						const introduction = DArray.first(sections) ?? "";

						return DArray.length(sections) > 1
							? DString.replace(
								introduction,
								markdownHeading,
								({ namedGroups }) => `${namedGroups.hashtag} [${namedGroups.title}](${DPath.computeRelative(argument.outputPathFolderFile, file.path)})`,
							)
							: introduction;
					},
				),
				DString.concat("\n"),
			),
			DEither.unwrapOr(null),
		);

		const indexHeading = rawIndexContent && DString.extract(rawIndexContent, indexHeadingPattern);
		const headingLevel = DCommon.justExec(() => {
			if (!indexHeading) {
				return argument.headingLevel ?? 2;
			}

			if (argument.headingLevel !== undefined) {
				return argument.headingLevel + 1;
			}

			return DString.length(indexHeading.namedGroups.heading ?? "##");
		});

		const indexContent = rawIndexContent && indexHeading
			? DString.replace(
				rawIndexContent,
				headingPrefix,
				renderHeading(headingLevel, argument.inputPathFolder),
			)
			: rawIndexContent;

		const markdownContent = DCommon.pipe(
			await DEither.rightAsyncPipe(
				entryGroupe.markdowns,
				DEither.toMaybe,
				DArray.map(
					(file) => {
						const fileName = file.getName();
						if (
							!fileName
							|| !DString.test(fileName, /^[0-9]+-/)
						) {
							return DEither.fail();
						}

						return DEither.rightAsyncPipe(
							DSFile.readTextFile(file.path),
							(content) => {
								if (DString.startsWith(fileName, "0")) {
									return DEither.success(content);
								}

								if (DString.test(content, markdownSeparator)) {
									const filePath = file.path;

									return DCommon.pipe(
										content,
										DString.split(markdownSeparator),
										DArray.first,
										DString.replace(
											markdownHeading,
											({ namedGroups }) => `${renderHeading(headingLevel + 1, argument.inputPathFolder)} [${namedGroups.title}](${DPath.computeRelative(argument.outputPathFolderFile, filePath)})`,
										),
										DEither.success,
									);
								}

								return DCommon.pipe(
									content,
									DString.replace(
										headingPrefix,
										() => renderHeading(headingLevel + 1, argument.inputPathFolder),
									),
									DEither.success,
								);
							},
							DString.concat("\n"),
						);
					},
				),
				DCommon.promiseAll,
				DArray.filter(DEither.isRight),
				DArray.map(DEither.unwrapRight),
			),
			DEither.unwrapOr(null),
		);

		const examplesContent = DCommon.pipe(
			await DEither.rightAsyncPipe(
				entryGroupe.examples,
				DEither.toMaybe,
				DGenerator.asyncReduce(
					DGenerator.reduceFrom<readonly string[]>([]),
					async({ lastValue, item, next }) => {
						const fileName = item.getName();

						if (
							!fileName
							|| !DString.test(fileName, /^[0-9]+-/)
						) {
							return next(lastValue);
						}

						const content = DEither.unwrapOr(
							await DSFile.readTextFile(item.path),
							null,
						);

						if (!content || !DString.includes(content, "*/")) {
							return next(lastValue);
						}

						const header = DCommon.pipe(
							DEither.rightPipe(
								content,
								DString.extract(/^\/\*\*(?<headerContent>[^]*?)\*\//),
								(extractResult) => DEither.toMaybe(extractResult?.namedGroups.headerContent),
								DString.split("\n"),
								DArray.filter(DString.isNotEmpty),
								DArray.map(DString.replace(/^ *\* */, "")),
								DString.join("\n"),
								DString.concat("\n"),
							),
							DEither.unwrapOr(null),
						);

						if (!header) {
							return next(lastValue);
						}

						if (DString.startsWith(fileName, "0")) {
							const exampleContent = DCommon.pipe(
								content,
								DString.replace(/^\/\*\*[^]*?\*\//, ""),
							);

							return DCommon.pipe(
								DArray.push(
									lastValue,
									"",
									DString.replace(
										header,
										/@title/g,
										renderHeading(headingLevel + 1, argument.inputPathFolder),
									),
									"",
									`\`\`\`${item.getExtension() ?? "txt"}${exampleContent}\`\`\`\n\n`,
								),
								next,
							);
						} else {
							return DCommon.pipe(
								DArray.push(
									lastValue,
									"",
									DString.replace(
										header,
										/@title *(?<title>[^\n]*)/g,
										({ namedGroups }) => `${renderHeading(headingLevel + 1, argument.inputPathFolder)} [${namedGroups.title}](${DPath.computeRelative(argument.outputPathFolderFile, item.path)})`,
									),
								),
								next,
							);
						}
					},
				),
			),
			DEither.unwrapOr(null),
		);

		const folderContent = DCommon.pipe(
			await DEither.rightAsyncPipe(
				entryGroupe.folders,
				DEither.toMaybe,
				DArray.select(
					({ element, skip, select }) => DString.test(element.getName() ?? "", /^[0-9]+-/)
						? select(element.path)
						: skip(),
				),
				DArray.map((path) => directoryToMarkdown({
					inputPathFolder: path,
					outputPathFolderFile: argument.outputPathFolderFile,
					isIgnore: argument.isIgnore,
					headingLevel: indexHeading
						? headingLevel
						: argument.headingLevel,
				})),
				DCommon.promiseAll,
				DArray.filter(DEither.isRight),
				DArray.map(DEither.unwrapRight),
			),
			DEither.unwrapOr(null),
		);

		return DArray.concat(
			indexContent ? [indexContent] : [],
			markdownContent ?? [],
			examplesContent ?? [],
			folderContent ?? [],
		);
	},
	(value) => DEither.right("render-success", DString.join(value, "")),
);
