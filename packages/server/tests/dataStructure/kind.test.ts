import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";
import { DSDataStructure } from "@scripts";

describe("createKind", () => {
	it("creates kinds in the server data structure namespace", () => {
		const kind = DSDataStructure.createKind<"test", number>("test");
		const result = kind.addTo({}, 42);

		type _CheckDefinition = DCommon.ExpectType<
			typeof kind.definition,
			DKind.Definition<"@DuplojsServerDataStructure/test", number>,
			"strict"
		>;

		expect(kind.runTimeKey).toBe(`${DKind.keyKindPrefix}@DuplojsServerDataStructure/test`);
		expect(kind.has(result)).toBe(true);
		expect(kind.getValue(result)).toBe(42);
	});

	it("rejects names containing namespace separators at type level", () => {
		// @ts-expect-error Kind names cannot contain @.
		DSDataStructure.createKind("bad@kind");
		// @ts-expect-error Kind names cannot contain /.
		DSDataStructure.createKind("bad/kind");
	});
});
