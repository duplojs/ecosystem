import type * as DCommon from "@scripts/common";
import type * as DChrono from "@scripts/chrono";
import type * as DArray from "@scripts/array";
import type * as DModeling from "@scripts/modeling";
import type * as DKind from "@scripts/kind";

declare const traversalLeafSymbol: unique symbol;

interface TraversalLeaf {
	readonly [traversalLeafSymbol]: true;
	readonly value: string;
}

declare module "@scripts/common" {
	interface ReplaceTraversalExclusions {
		testTraversalLeaf: TraversalLeaf;
	}
}

describe("Replace", () => {
	it("preserves optional properties when another property is replaced", () => {
		type Result = DCommon.Replace<
			{
				readonly name: string;
				readonly age?: number;
				readonly createdAt?: DChrono.TheDate;
			},
			[string, number],
			"extends"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly name: number;
				readonly age?: number;
				readonly createdAt?: DChrono.TheDate;
			},
			"strict"
		>;
	});

	it("replaces optional property values in extends mode", () => {
		type Result = DCommon.Replace<
			{
				readonly name?: string;
				readonly age?: number;
			},
			[string, number],
			"extends"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly name?: number;
				readonly age?: number;
			},
			"strict"
		>;
	});

	it("replaces optional property values in equal mode", () => {
		type Result = DCommon.Replace<
			{
				readonly name?: string;
				readonly age?: number;
			},
			[string, number],
			"equal"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly name?: number;
				readonly age?: number;
			},
			"strict"
		>;
	});

	it("preserves optional properties in nested objects", () => {
		type Result = DCommon.Replace<
			{
				readonly user?: {
					readonly name: string;
					readonly age?: number;
				};
			},
			[string, number],
			"extends"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly user?: {
					readonly name: number;
					readonly age?: number;
				};
			},
			"strict"
		>;
	});

	it("preserves undefined values and required union properties", () => {
		type Result = DCommon.Replace<
			{
				readonly name: string;
				readonly age: number | undefined;
				readonly missing?: undefined;
			},
			[string, number],
			"extends"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly name: number;
				readonly age: number | undefined;
				readonly missing?: undefined;
			},
			"strict"
		>;
	});

	it("keeps the original object when no property is replaced", () => {
		interface User {
			readonly age?: number;
			readonly createdAt?: DChrono.TheDate;
		}

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<User, [string, number], "extends">,
			User,
			"strict"
		>;
	});

	it("replaces values throughout a recursive object", () => {
		interface User {
			readonly name: string;
			readonly age?: number;
			readonly createdAt?: DChrono.TheDate;
			readonly friends?: User;
		}

		interface ExpectedUser {
			readonly name: number;
			readonly age?: number;
			readonly createdAt?: DChrono.TheDate;
			readonly friends?: ExpectedUser;
		}

		type Result = DCommon.Replace<User, [string, number], "extends">;

		type _CheckResult = DCommon.ExpectType<Result, ExpectedUser, "strict">;
		type _CheckNested = DCommon.ExpectType<
			NonNullable<NonNullable<Result["friends"]>["friends"]>["name"],
			number,
			"strict"
		>;
	});

	it("replaces values in recursive arrays in equal mode", () => {
		interface Node {
			readonly value: string;
			readonly children: readonly Node[];
		}

		interface ExpectedNode {
			readonly value: number;
			readonly children: readonly ExpectedNode[];
		}

		type Result = DCommon.Replace<Node, [string, number], "equal">;

		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<
			Result["children"][number]["children"][number]["value"],
			number,
			"strict"
		>;
	});

	it("finds replacements through mutually recursive objects", () => {
		interface First {
			readonly second: Second;
		}

		interface Second {
			readonly first?: First;
			readonly value: string;
		}

		interface ExpectedFirst {
			readonly second: ExpectedSecond;
		}

		interface ExpectedSecond {
			readonly first?: ExpectedFirst;
			readonly value: number;
		}

		type Result = DCommon.Replace<First, [string, number], "extends">;

		type _CheckResult = DCommon.ExpectType<Result, ExpectedFirst, "strict">;
	});

	it("handles tuples and union branches inside recursive objects", () => {
		interface Node {
			readonly entry: readonly [string, Node | null];
		}

		interface ExpectedNode {
			readonly entry: readonly [number, ExpectedNode | null];
		}

		type Result = DCommon.Replace<Node, [string, number], "extends">;

		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<
			NonNullable<NonNullable<Result["entry"][1]>["entry"][1]>["entry"][0],
			number,
			"strict"
		>;
	});

	it("preserves array constraints in recursive objects", () => {
		interface Node {
			readonly value: string;
			readonly children: readonly Node[] & DArray.MinElements<1>;
		}

		interface ExpectedNode {
			readonly value: number;
			readonly children: readonly ExpectedNode[] & DArray.MinElements<1>;
		}

		type Result = DCommon.Replace<Node, [string, number], "extends">;

		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckValue = DCommon.ExpectType<
			Result["children"][number]["value"],
			number,
			"strict"
		>;
	});

	it("replaces a recursive type directly without traversing it", () => {
		interface Node {
			readonly next: Node;
		}

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<Node, [Node, number], "equal">,
			number,
			"strict"
		>;
	});

	it("keeps the original recursive type when there is no replacement", () => {
		interface Node {
			value: number;
			next?: Node;
			children: Node[];
		}

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<Node, [string, boolean], "extends">,
			Node,
			"strict"
		>;
	});

	it("preserves tuple structure when sharing object and array reconstruction", () => {
		type _CheckArray = DCommon.ExpectType<
			DCommon.Replace<string[], [string, number], "extends">,
			readonly number[],
			"strict"
		>;
		type _CheckTuple = DCommon.ExpectType<
			DCommon.Replace<readonly [string, string?, ...string[]], [string, number], "extends">,
			readonly [number, number?, ...number[]],
			"strict"
		>;
	});

	it("preserves entity and object tag metadata without retaining the original properties", () => {
		interface Input {
			readonly entity: { readonly value: string } & DModeling.Entity<"Node"> & DCommon.Constraint<"node">;
			readonly tagged: { readonly value: string } & DModeling.ObjectTag<"node">;
		}
		type Result = DCommon.Replace<Input, [string, number], "extends">;

		type _CheckEntityValue = DCommon.ExpectType<Result["entity"]["value"], number, "strict">;
		type _CheckEntityName = DCommon.ExpectType<DModeling.GetEntityName<Result["entity"]>, "Node", "strict">;
		type _CheckEntityConstraint = DCommon.ExpectType<
			DCommon.GetConstraint<Result["entity"]>,
			DCommon.Constraint<"node">,
			"strict"
		>;
		type _CheckTagValue = DCommon.ExpectType<Result["tagged"]["value"], number, "strict">;
		type _CheckTagName = DCommon.ExpectType<DModeling.GetTagValue<Result["tagged"]>, "node", "strict">;
	});

	it("distributes replacement rules and comparison modes", () => {
		type _CheckRules = DCommon.ExpectType<
			DCommon.Replace<readonly [string, number, boolean], [string, number] | [number, boolean], "extends">,
			readonly [number, boolean, boolean],
			"strict"
		>;
		type _CheckModes = DCommon.ExpectType<
			DCommon.Replace<"literal", [string, number], "extends" | "equal">,
			number | "literal",
			"strict"
		>;

		interface Unmatched {
			value: string;
		}

		type _CheckObjectModes = DCommon.ExpectType<
			DCommon.Replace<Unmatched, [{ value: unknown }, number], "extends" | "equal">,
			number | Unmatched,
			"strict"
		>;
	});

	it("distinguishes a never replacement from an unmatched rule", () => {
		type _CheckNever = DCommon.ExpectType<
			DCommon.Replace<{ readonly value?: string }, [string, never], "extends">,
			{ readonly value?: never },
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.Replace<readonly [string, "literal"], [string, number], "equal">,
			readonly [number, "literal"],
			"strict"
		>;
	});

	it("preserves multiple constraints and known kinds on recursive objects", () => {
		type Node = (
			& {
				readonly value: string;
				readonly next?: Node;
			}
			& DCommon.Constraint<"first", "kept">
			& DCommon.Constraint<"second", 42>
			& DModeling.Entity<"Node">
			& DModeling.ObjectTag<"node">
		);
		type Result = DCommon.Replace<Node, [string, number], "extends">;

		type _CheckValue = DCommon.ExpectType<Result["value"], number, "strict">;
		type _CheckNestedValue = DCommon.ExpectType<NonNullable<Result["next"]>["value"], number, "strict">;
		type _CheckFirstConstraint = DCommon.ExpectType<Result[DCommon.ConstraintSymbol]["first"], "kept", "strict">;
		type _CheckSecondConstraint = DCommon.ExpectType<Result[DCommon.ConstraintSymbol]["second"], 42, "strict">;
		type _CheckEntity = DCommon.ExpectType<DModeling.GetEntityName<Result>, "Node", "strict">;
		type _CheckTag = DCommon.ExpectType<DModeling.GetTagValue<Result>, "node", "strict">;
	});

	it("does not reattach unknown kinds after a replacement", () => {
		type CustomKind = DKind.Kind<DKind.Handler<DKind.Definition<"custom", undefined>>>;
		type Input = { readonly value: string } & CustomKind;

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<Input, [string, number], "extends">,
			{ readonly value: number },
			"strict"
		>;
	});

	it("keeps the original constrained and branded type when only its metadata matches", () => {
		type Input = (
			& { value: number }
			& DCommon.Constraint<"source", "kept">
			& DModeling.Entity<"Node">
			& DModeling.ObjectTag<"node">
		);

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<Input, [string, boolean], "extends">,
			Input,
			"strict"
		>;
	});

	it("keeps unchanged branches when a sibling property is replaced", () => {
		interface Stable {
			value: number;
			next?: Stable;
			children: Stable[];
		}

		interface Input {
			readonly name: string;
			readonly stable: Stable;
			readonly array: Stable[];
			readonly tuple: [Stable, Stable?];
		}

		type Result = DCommon.Replace<Input, [string, number], "extends">;

		type _CheckName = DCommon.ExpectType<Result["name"], number, "strict">;
		type _CheckStable = DCommon.ExpectType<Result["stable"], Stable, "strict">;
		type _CheckArray = DCommon.ExpectType<Result["array"], Stable[], "strict">;
		type _CheckTuple = DCommon.ExpectType<Result["tuple"], [Stable, Stable?], "strict">;
	});

	it("keeps unmatched union members when another member is replaced", () => {
		interface Stable {
			value: number;
			children: Stable[];
		}

		type Result = DCommon.Replace<
			Stable | { readonly name: string },
			[string, number],
			"equal"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			Stable | { readonly name: number },
			"strict"
		>;
	});

	it("keeps unknown kinds and constraints on unchanged nested branches", () => {
		type CustomKind = DKind.Kind<DKind.Handler<DKind.Definition<"custom", undefined>>>;
		type Stable = { value: number } & CustomKind & DCommon.Constraint<"source", "kept">;
		type Result = DCommon.Replace<
			{
				readonly name: string;
				readonly stable: Stable;
			},
			[string, number],
			"extends"
		>;

		type _CheckName = DCommon.ExpectType<Result["name"], number, "strict">;
		type _CheckStable = DCommon.ExpectType<Result["stable"], Stable, "strict">;
	});

	it("allows directly replacing a type excluded from traversal in both comparison modes", () => {
		type _CheckExtends = DCommon.ExpectType<
			DCommon.Replace<TraversalLeaf, [TraversalLeaf, number], "extends">,
			number,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.Replace<TraversalLeaf, [TraversalLeaf, number], "equal">,
			number,
			"strict"
		>;
	});

	it("allows directly replacing excluded types inside a tuple", () => {
		type Input = readonly [DChrono.TheDate, DChrono.TheTime, DCommon.DuploJSError, TraversalLeaf];
		type Rules = (
			| [DChrono.TheDate, string]
			| [DChrono.TheTime, number]
			| [DCommon.DuploJSError, boolean]
			| [TraversalLeaf, null]
		);

		type _CheckResult = DCommon.ExpectType<
			DCommon.Replace<Input, Rules, "equal">,
			readonly [string, number, boolean, null],
			"strict"
		>;
	});

	it("does not search for replacements in excluded properties", () => {
		type _CheckExtends = DCommon.ExpectType<
			DCommon.Replace<TraversalLeaf, [string, number], "extends">,
			TraversalLeaf,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.Replace<TraversalLeaf, [string, number], "equal">,
			TraversalLeaf,
			"strict"
		>;
	});

	it("keeps excluded properties intact when a sibling property is replaced", () => {
		type Result = DCommon.Replace<
			{
				readonly label: string;
				readonly leaf: TraversalLeaf;
			},
			[string, number],
			"extends"
		>;

		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly label: number;
				readonly leaf: TraversalLeaf;
			},
			"strict"
		>;
	});
});
