import { resolver, type ResolverParams } from "./resolver";

export interface BeforeWriteFileDtsHookResolverParams extends Pick<
	ResolverParams,
	"includedPath" | "lineChar"
> { }

export function beforeWriteFileDtsHook(
	params: BeforeWriteFileDtsHookResolverParams,
) {
	return (filePath: string, content: string) => resolver(
		{
			source: content,
			includedPath: params.includedPath,
			lineChar: params.lineChar,
		},
	)
		.then(
			(result) => ({
				filePath,
				content: result,
			}),
		);
}
