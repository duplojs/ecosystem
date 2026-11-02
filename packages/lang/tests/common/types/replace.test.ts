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

	describe("recursive output constraints", () => {
		// Keep failing declarations unsuppressed: they expose recursive output constraint limits.
		it("replaces concrete recursive arrays in both modes", () => {
			type Input = string | readonly Input[];
			type Expected = number | readonly Expected[];
			type Container<GenericValue extends Expected> = GenericValue;
			type ExtendsResult = Container<DCommon.Replace<Input, [string, number], "extends">>;
			type EqualResult = Container<DCommon.Replace<Input, [string, number], "equal">>;

			type _CheckExtends = DCommon.ExpectType<ExtendsResult, Expected, "strict">;
			type _CheckEqual = DCommon.ExpectType<EqualResult, Expected, "strict">;
		});

		it("replaces generic recursive values without a constrained output container", () => {
			type Value = string | readonly Value[];
			type ReplaceExtends<GenericValue extends Value> = DCommon.Replace<GenericValue, [string, number], "extends">;
			type ReplaceEqual<GenericValue extends Value> = DCommon.Replace<GenericValue, [string, number], "equal">;

			type _CheckExtends = DCommon.ExpectType<ReplaceExtends<readonly (readonly string[])[]>, readonly (readonly number[])[], "strict">;
			type _CheckEqual = DCommon.ExpectType<ReplaceEqual<readonly (readonly string[])[]>, readonly (readonly number[])[], "strict">;
		});

		it("preserves a generic recursive array when the rule cannot match", () => {
			type Value = string | readonly Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type ReplaceExtends<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [Date, number], "extends">>;
			type ReplaceEqual<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [Date, number], "equal">>;

			type _CheckExtends = DCommon.ExpectType<ReplaceExtends<readonly string[]>, readonly string[], "strict">;
			type _CheckEqual = DCommon.ExpectType<ReplaceEqual<readonly string[]>, readonly string[], "strict">;
		});

		it("accepts a generic recursive record without recursive arrays", () => {
			type Value = string | { readonly [key: string]: Value };
			type Container<GenericValue extends Value> = GenericValue;
			type ReplaceExtends<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [string, string], "extends">>;
			type ReplaceEqual<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [string, string], "equal">>;

			type _CheckExtends = DCommon.ExpectType<ReplaceExtends<{ readonly value: string }>, { readonly value: string }, "strict">;
			type _CheckEqual = DCommon.ExpectType<ReplaceEqual<{ readonly value: string }>, { readonly value: string }, "strict">;
		});

		// Keep these declarations unsuppressed: they expose the generic recursion limit.
		// An identity rule still matches and exercises reconstruction instead of the no-match shortcut.
		it("accepts a generic recursive array when a matching rule preserves its leaves", () => {
			type Value = string | readonly Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type ReplaceExtends<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [string, string], "extends">>;
			type ReplaceEqual<GenericValue extends Value> = Container<DCommon.Replace<GenericValue, [string, string], "equal">>;

			type _CheckExtends = DCommon.ExpectType<ReplaceExtends<readonly string[]>, readonly string[], "strict">;
			type _CheckEqual = DCommon.ExpectType<ReplaceEqual<readonly string[]>, readonly string[], "strict">;
		});

		it("rebuilds a constrained container after inferring its recursive values", () => {
			type Value = string | readonly Value[];
			interface Container<GenericValue extends Value> {
				readonly value: GenericValue;
			}
			type ReplaceExtends<GenericInput> = GenericInput extends Container<infer InferredValue>
				? Container<DCommon.Replace<InferredValue, [string, string], "extends">>
				: never;
			type ReplaceEqual<GenericInput> = GenericInput extends Container<infer InferredValue>
				? Container<DCommon.Replace<InferredValue, [string, string], "equal">>
				: never;
			type Input = Container<readonly string[]>;

			type _CheckExtends = DCommon.ExpectType<ReplaceExtends<Input>["value"], readonly string[], "strict">;
			type _CheckEqual = DCommon.ExpectType<ReplaceEqual<Input>["value"], readonly string[], "strict">;
		});
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

	it("preserves a flag and its payload in both comparison modes", () => {
		interface Payload {
			readonly source: string;
			readonly at: DChrono.TheDate;
		}
		type Metadata = DModeling.Entity<"User"> & DModeling.Flag<"Verified", Payload>;
		type Input = { readonly value: string } & Metadata;
		type Expected = { readonly value: number } & Metadata;
		type ExtendsResult = DCommon.Replace<Input, [string, number], "extends">;
		type EqualResult = DCommon.Replace<Input, [string, number], "equal">;

		type _CheckExtends = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<ExtendsResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<EqualResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckExtendsPayload = DCommon.ExpectType<DModeling.GetFlagPayload<ExtendsResult>, Payload, "strict">;
		type _CheckEqualPayload = DCommon.ExpectType<DModeling.GetFlagPayload<EqualResult>, Payload, "strict">;
	});

	it("preserves a fact and its payload in both comparison modes", () => {
		interface Payload {
			readonly source: string;
			readonly at: DChrono.TheDate;
		}
		type Metadata = DModeling.Entity<"User"> & DModeling.Fact<"UserCreated", Payload>;
		type Input = { readonly value: string } & Metadata;
		type Expected = { readonly value: number } & Metadata;
		type ExtendsResult = DCommon.Replace<Input, [string, number], "extends">;
		type EqualResult = DCommon.Replace<Input, [string, number], "equal">;

		type _CheckExtends = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<ExtendsResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<EqualResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckName = DCommon.ExpectType<DModeling.GetFactName<ExtendsResult>, "UserCreated", "strict">;
		type _CheckExtendsPayload = DCommon.ExpectType<DModeling.GetFactPayload<ExtendsResult>, Payload, "strict">;
		type _CheckEqualPayload = DCommon.ExpectType<DModeling.GetFactPayload<EqualResult>, Payload, "strict">;
	});

	it("preserves several flags, a fact, an entity, a tag and constraints together", () => {
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.ObjectTag<"user">
			& DModeling.Flag<"Verified", "checked">
			& DModeling.Flag<"Authorized", { readonly role: string }>
			& DModeling.Fact<"UserCreated", { readonly name: string }>
			& DCommon.Constraint<"first", "kept">
			& DCommon.Constraint<"second", { readonly source: string }>
		);
		type Input = { readonly value?: string } & Metadata;
		type Expected = { readonly value?: number } & Metadata;
		type ExtendsResult = DCommon.Replace<Input, [string, number], "extends">;
		type EqualResult = DCommon.Replace<Input, [string, number], "equal">;

		type _CheckExtends = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<ExtendsResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<EqualResult>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckKinds = DCommon.ExpectType<ExtendsResult[DKind.KeySymbol], Metadata[DKind.KeySymbol], "strict">;
		type _CheckConstraints = DCommon.ExpectType<
			ExtendsResult[DCommon.ConstraintSymbol],
			Metadata[DCommon.ConstraintSymbol],
			"strict"
		>;
	});

	it("does not start a replacement when only annotation names and payloads match", () => {
		type Input = (
			& { value: number }
			& DModeling.Entity<"User">
			& DModeling.ObjectTag<"user">
			& DModeling.Flag<"Verified", { readonly source: string }>
			& DModeling.Fact<"Created", { readonly source: string }>
			& DCommon.Constraint<"source", string>
		);

		type _CheckExtends = DCommon.ExpectType<DCommon.Replace<Input, [string, boolean], "extends">, Input, "strict">;
		type _CheckEqual = DCommon.ExpectType<DCommon.Replace<Input, [string, boolean], "equal">, Input, "strict">;
	});

	it("does not apply a rule matching an entire annotation payload when a property changes", () => {
		interface Payload {
			readonly source: string;
		}
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Payload>
			& DModeling.Fact<"Created", Payload>
			& DCommon.Constraint<"source", Payload>
		);
		type Input = { readonly value: string } & Metadata;
		type Expected = { readonly value: number } & Metadata;
		type Rules = [string, number] | [Payload, null];

		type _CheckExtends = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<DCommon.Replace<Input, Rules, "extends">>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<DCommon.Replace<Input, Rules, "equal">>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("transforms an ordinary property while keeping the same type opaque inside metadata", () => {
		interface Payload {
			readonly source: string;
		}
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Payload>
			& DModeling.Fact<"Created", Payload>
			& DCommon.Constraint<"source", Payload>
		);
		type Result = DCommon.Replace<{ readonly payload: Payload } & Metadata, [Payload, null], "equal">;
		type Expected = { readonly payload: null } & Metadata;

		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves parent and child annotations independently", () => {
		type ParentMetadata = DModeling.Entity<"Parent"> & DModeling.Flag<"Verified", string>;
		type ChildMetadata = (
			& DModeling.ObjectTag<"child">
			& DModeling.Fact<"Created", { readonly source: string }>
			& DCommon.Constraint<"source", string>
		);
		type Child = { readonly value: string } & ChildMetadata;
		type ExpectedChild = { readonly value: number } & ChildMetadata;
		type Result = DCommon.Replace<{ readonly child?: Child } & ParentMetadata, [string, number], "extends">;

		type _CheckChild = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<NonNullable<Result["child"]>>,
			DCommon.SimplifyTopLevel<ExpectedChild>,
			"strict"
		>;
		type _CheckParentKinds = DCommon.ExpectType<Result[DKind.KeySymbol], ParentMetadata[DKind.KeySymbol], "strict">;
	});

	it("preserves annotated array elements and array cardinality constraints", () => {
		type Metadata = DModeling.Entity<"User"> & DModeling.Flag<"Verified", string>;
		type Input = { readonly value: string } & Metadata;
		type Expected = { readonly value: number } & Metadata;
		type ExtendsResult = DCommon.Replace<readonly Input[] & DArray.MinElements<1>, [string, number], "extends">;
		type EqualResult = DCommon.Replace<Input[] & DArray.MinElements<1>, [string, number], "equal">;

		type _CheckExtends = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<ExtendsResult[number]>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckEqual = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<EqualResult[number]>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckConstraints = DCommon.ExpectType<DCommon.GetConstraint<ExtendsResult>, DArray.MinElements<1>, "strict">;
	});

	it("preserves annotated optional tuple elements and tuple constraints", () => {
		type Metadata = DModeling.Entity<"User"> & DModeling.Fact<"Created", { readonly name: string }>;
		type Input = { readonly value: string } & Metadata;
		type Expected = { readonly value: number } & Metadata;
		type Result = DCommon.Replace<readonly [Input, Input?] & DCommon.Constraint<"pair">, [string, number], "equal">;

		type _CheckFirst = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result[0]>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckOptional = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result[1]>,
			DCommon.SimplifyTopLevel<Expected> | undefined,
			"strict"
		>;
		type _CheckConstraint = DCommon.ExpectType<DCommon.GetConstraint<Result>, DCommon.Constraint<"pair">, "strict">;
	});

	it("preserves modeling annotations and constraints through recursive properties", () => {
		type Metadata = (
			& DModeling.Entity<"Node">
			& DModeling.Flag<"Verified", { readonly source: string }>
			& DModeling.Fact<"Created", { readonly source: string }>
			& DCommon.Constraint<"source", string>
		);
		type Node = {
			readonly value: string;
			readonly next?: Node;
		} & Metadata;
		type Result = DCommon.Replace<Node, [string, number], "extends">;
		type Next = NonNullable<Result["next"]>;

		type _CheckValue = DCommon.ExpectType<Result["value"], number, "strict">;
		type _CheckNestedValue = DCommon.ExpectType<Next["value"], number, "strict">;
		type _CheckKinds = DCommon.ExpectType<Result[DKind.KeySymbol], Metadata[DKind.KeySymbol], "strict">;
		type _CheckNestedKinds = DCommon.ExpectType<Next[DKind.KeySymbol], Metadata[DKind.KeySymbol], "strict">;
		type _CheckNestedConstraint = DCommon.ExpectType<DCommon.GetConstraint<Next>, DCommon.Constraint<"source", string>, "strict">;
	});

	it("preserves recursive annotation payloads without traversing them", () => {
		interface Payload {
			readonly source: string;
			readonly next?: Payload;
		}
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Payload>
			& DModeling.Fact<"Created", Payload>
			& DCommon.Constraint<"source", Payload>
		);
		type Result = DCommon.Replace<{ readonly value: string } & Metadata, [string, number], "equal">;
		type Expected = { readonly value: number } & Metadata;

		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves an unchanged annotated branch when a sibling property is replaced", () => {
		type Stable = (
			& { value: number }
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", string>
			& DModeling.Fact<"Created", { readonly source: string }>
			& DCommon.Constraint<"source", string>
		);
		type Result = DCommon.Replace<{
			readonly value: string;
			readonly stable: Stable;
		}, [string, number], "equal">;

		type _CheckValue = DCommon.ExpectType<Result["value"], number, "strict">;
		type _CheckStable = DCommon.ExpectType<Result["stable"], Stable, "strict">;
	});

	it("preserves fact discrimination across union members after replacement", () => {
		type Created = { readonly value: string } & DModeling.Entity<"User"> & DModeling.Fact<"Created", { name: string }>;
		type Deleted = { readonly value: string } & DModeling.Entity<"User"> & DModeling.Fact<"Deleted", { reason: string }>;
		type Result = DCommon.Replace<Created | Deleted, [string, number], "extends">;
		type CreatedResult = Extract<Result, DModeling.Fact<"Created">>;
		type DeletedResult = Extract<Result, DModeling.Fact<"Deleted">>;

		type _CheckCreatedValue = DCommon.ExpectType<CreatedResult["value"], number, "strict">;
		type _CheckDeletedValue = DCommon.ExpectType<DeletedResult["value"], number, "strict">;
		type _CheckCreatedPayload = DCommon.ExpectType<DModeling.GetFactPayload<CreatedResult>, { name: string }, "strict">;
		type _CheckDeletedPayload = DCommon.ExpectType<DModeling.GetFactPayload<DeletedResult>, { reason: string }, "strict">;
	});

	it("preserves the correlation between a flag payload and ordinary union properties", () => {
		type First = { readonly value: string } & DModeling.Entity<"User"> & DModeling.Flag<"State", "first">;
		type Second = { readonly value: boolean } & DModeling.Entity<"User"> & DModeling.Flag<"State", "second">;
		type Result = DCommon.Replace<First | Second, [string, number], "equal">;
		type FirstResult = Extract<Result, DModeling.Flag<"State", "first">>;
		type SecondResult = Extract<Result, DModeling.Flag<"State", "second">>;

		type _CheckFirst = DCommon.ExpectType<FirstResult["value"], number, "strict">;
		type _CheckSecond = DCommon.ExpectType<SecondResult, Second, "strict">;
	});

	it("does not reattach annotations when the entire annotated value is directly replaced", () => {
		type Input = (
			& { readonly value: string }
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", string>
			& DModeling.Fact<"Created", { readonly name: string }>
			& DCommon.Constraint<"source", string>
		);

		type _CheckExtends = DCommon.ExpectType<DCommon.Replace<Input, [Input, number], "extends">, number, "strict">;
		type _CheckEqual = DCommon.ExpectType<DCommon.Replace<Input, [Input, number], "equal">, number, "strict">;
	});
});
