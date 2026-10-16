import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure } from "@scripts";

describe("ConstraintsStore", () => {
	it("registers all server constraints with their exact types", () => {
		type _CheckStore = DCommon.ExpectType<
			Pick<DDataStructure.ConstraintsStore, "fileExist" | "folderExist" | "size" | "mimeType">,
			{
				fileExist: DSDataStructure.FileExistConstraint;
				folderExist: DSDataStructure.FolderExistConstraint;
				size: DSDataStructure.SizeConstraint;
				mimeType: DSDataStructure.MimeTypeConstraint;
			},
			"strict"
		>;

		type _CheckUnion = DCommon.ExpectType<
			Extract<
				DDataStructure.Constraints,
				| DSDataStructure.FileExistConstraint
				| DSDataStructure.FolderExistConstraint
				| DSDataStructure.SizeConstraint
				| DSDataStructure.MimeTypeConstraint
			>,
			| DSDataStructure.FileExistConstraint
			| DSDataStructure.FolderExistConstraint
			| DSDataStructure.SizeConstraint
			| DSDataStructure.MimeTypeConstraint,
			"strict"
		>;

		const constraints: Pick<DDataStructure.ConstraintsStore, "fileExist" | "folderExist" | "size" | "mimeType"> = {
			fileExist: DSDataStructure.fileExist(),
			folderExist: DSDataStructure.folderExist(),
			size: DSDataStructure.size({}),
			mimeType: DSDataStructure.mimeType("text/plain"),
		};

		expect(DSDataStructure.fileExistConstraintKind.has(constraints.fileExist)).toBe(true);
		expect(DSDataStructure.folderExistConstraintKind.has(constraints.folderExist)).toBe(true);
		expect(DSDataStructure.sizeConstraintKind.has(constraints.size)).toBe(true);
		expect(DSDataStructure.mimeTypeConstraintKind.has(constraints.mimeType)).toBe(true);
	});
});
