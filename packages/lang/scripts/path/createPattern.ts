import type { Path } from "./constraints";

export type PathMatcher = (path: string & Path) => boolean;

interface PatternRule {
	regex: RegExp;
	negative: boolean;
}

const regexSpecialCharacters = /[\\^$.*+?()[\]{}|]/g;

const posixClassByName: Readonly<Record<string, string>> = {
	alnum: "A-Za-z0-9",
	alpha: "A-Za-z",
	ascii: "\\x00-\\x7F",
	blank: " \\t",
	cntrl: "\\x00-\\x1F\\x7F",
	digit: "0-9",
	graph: "!-~",
	lower: "a-z",
	print: " -~",
	punct: "!-/:-@\\[-`\\{-~",
	space: "\\t\\n\\v\\f\\r ",
	upper: "A-Z",
	word: "A-Za-z0-9_",
	xdigit: "A-Fa-f0-9",
};

export function createPattern(
	patterns: string | readonly string[],
): PathMatcher {
	const rules: PatternRule[] = [];
	const patternList: readonly string[] = Array.isArray(patterns)
		? patterns
		: [patterns];

	for (let pattern of patternList) {
		for (let index = pattern.length - 1; index >= 0; index--) {
			if (pattern[index] !== " ") {
				break;
			}

			let backslashesCount = 0;

			for (let cursor = index - 1; cursor >= 0; cursor--) {
				if (pattern[cursor] !== "\\") {
					break;
				}

				backslashesCount++;
			}

			if (backslashesCount % 2 === 1) {
				pattern = `${pattern.slice(0, index - 1)}${pattern.slice(index)}`;
				break;
			}

			pattern = pattern.slice(0, index);
		}

		if (pattern === "" || pattern.startsWith("#")) {
			continue;
		}

		const negative = pattern.startsWith("!");

		if (negative) {
			pattern = pattern.slice(1);
		}

		if (pattern === "") {
			continue;
		}

		const directorySyntax = pattern.endsWith("/");

		if (directorySyntax) {
			pattern = pattern.slice(0, -1);
		}

		const anchored = pattern.startsWith("/");

		if (anchored) {
			pattern = pattern.slice(1);
		}

		if (directorySyntax && pattern.endsWith("/**")) {
			pattern = pattern.slice(0, -3);
		}

		if (pattern === "" || pattern.endsWith("\\")) {
			continue;
		}

		const rootRelative = anchored || pattern.includes("/");
		let source = rootRelative
			? "^/?"
			: "(?:^|/)";

		for (let index = 0; index < pattern.length; index++) {
			const character = pattern.charAt(index);

			if (character === "\\") {
				index++;
				source += pattern.charAt(index).replaceAll(regexSpecialCharacters, "\\$&");
				continue;
			}

			if (character === "?") {
				source += "[^/]";
				continue;
			}

			if (character === "*") {
				let endIndex = index + 1;

				for (; pattern[endIndex] === "*"; endIndex++) {}

				const starsCount = endIndex - index;
				const segmentStart = index === 0 || pattern[index - 1] === "/";
				const segmentEnd = endIndex === pattern.length || pattern[endIndex] === "/";

				if (starsCount === 2 && segmentStart && segmentEnd && pattern[endIndex] === "/") {
					source += "(?:[^/]+/)*";
					index = endIndex;
					continue;
				}

				if (starsCount === 2 && segmentStart && endIndex === pattern.length) {
					source += ".*";
					index = endIndex - 1;
					continue;
				}

				source += "[^/]*";
				index = endIndex - 1;
				continue;
			}

			if (character === "[") {
				let cursor = index + 1;
				let classNegative = false;

				if (pattern[cursor] === "!" || pattern[cursor] === "^") {
					classNegative = true;
					cursor++;
				}

				let classBody = "";

				if (pattern[cursor] === "]") {
					classBody += "\\]";
					cursor++;
				}

				let closed = false;

				for (; cursor < pattern.length; cursor++) {
					const classCharacter = pattern.charAt(cursor);

					if (classCharacter === "]") {
						closed = true;
						break;
					}

					if (classCharacter === "\\" && cursor + 1 < pattern.length) {
						cursor++;
						classBody += pattern.charAt(cursor).replaceAll(regexSpecialCharacters, "\\$&");
						continue;
					}

					if (classCharacter === "[" && pattern[cursor + 1] === ":") {
						const classEndIndex = pattern.indexOf(":]", cursor + 2);

						if (classEndIndex !== -1) {
							const className = pattern.slice(cursor + 2, classEndIndex);
							const classSource = posixClassByName[className];

							if (classSource !== undefined) {
								classBody += classSource;
								cursor = classEndIndex + 1;
								continue;
							}
						}
					}

					classBody += classCharacter === "[" ? "\\[" : classCharacter;
				}

				if (closed && classBody !== "") {
					const classSource = `[${classNegative ? "^" : ""}${classBody}]`;

					try {
						new RegExp(classSource);

						source += `(?:(?!/)${classSource})`;
						index = cursor;
						continue;
					} catch {}
				}

				source += "\\[";
				continue;
			}

			source += character.replaceAll(regexSpecialCharacters, "\\$&");
		}

		source += "(?=$|/)";
		rules.push({
			regex: new RegExp(source),
			negative,
		});
	}

	return (path: string & Path): boolean => {
		let selected = false;

		for (const rule of rules) {
			if (rule.regex.test(path)) {
				selected = !rule.negative;
			}
		}

		return selected;
	};
}
