import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DString from "@duplojs/lang/string";
import * as DArray from "@duplojs/lang/array";
import * as DPattern from "@duplojs/lang/pattern";
import * as DPath from "@duplojs/lang/path";

export const directoryToMarkdown: (
	params: {
		inputPathFolder: string & DPath.Absolute;
		outputPathFolderFile: string & DPath.Absolute;
	},
) => Promise<
	| DEither.Left<"read-folder-error">
	| DEither.Right<"render-success", string>
> = DInvocation.flow(
	({ inputPathFolder }) => DSFile.walkDirectory(DCommon.cast(inputPathFolder)),
	DInvocation.filter(
		DEither.whenHasInformationOtherwise(
			"file-system-walk-directory",
			DCommon.forward,
			(value) => DEither.left("read-folder-error", value),
		),
	),
	DArray.from,
	DArray.group(
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
		const indexContent = DCommon.pipe(
			await DEither.rightAsyncPipe(
				entryGroupe.indexes,
				DEither.toMaybe,
				DArray.first,
				(file) => DSFile.readTextFile(file.path),
				DString.concat("\n"),
			),
			DEither.unwrapOr(null),
		);

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

								if (DString.includes(content, "---")) {
									const filePath = file.path;

									if (!DPath.isAbsolute(filePath)) {
										return DEither.fail();
									}

									return DCommon.pipe(
										content,
										DString.split("---"),
										DArray.first,
										DString.replace(
											/(?<hashtag>#+) (?<title>[^\n]+)/g,
											({ namedGroups }) => `${namedGroups.hashtag} [${namedGroups.title}](${DPath.computeRelative(argument.outputPathFolderFile, filePath)})`,
										),
										DEither.success,
									);
								}

								return DEither.success(content);
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
						const filePath = item.path;
						if (
							!fileName
							|| !DPath.isAbsolute(filePath)
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
								DString.extract(/^\/\*\*(?<headerContent>[^]*)\*\//),
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
								DString.split("*/"),
								DArray.last,
							);

							return DCommon.pipe(
								DArray.push(
									lastValue,
									"",
									DString.replace(
										header,
										/@title/g,
										"###",
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
										({ namedGroups }) => `### [${namedGroups.title}](${DPath.computeRelative(argument.outputPathFolderFile, filePath)})`,
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
					({ element, skip, select }) => DPath.isAbsolute(element.path)
						&& DString.test(element.getName() ?? "", /^[0-9]+-/)
						? select(element.path)
						: skip(),
				),
				DArray.map((path) => directoryToMarkdown({
					inputPathFolder: path,
					outputPathFolderFile: argument.outputPathFolderFile,
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
