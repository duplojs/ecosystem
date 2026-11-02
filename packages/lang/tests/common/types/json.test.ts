import type * as DCommon from "@scripts/common";
import type * as DChrono from "@scripts/chrono";
import type * as DArray from "@scripts/array";
import type * as DString from "@scripts/string";
import type * as DNumber from "@scripts/number";
import type * as DModeling from "@scripts/modeling";
import type * as DKind from "@scripts/kind";

// ToJson describes a type transformation, not a runtime JSON.stringify validator.
// In particular, it preserves undefined and passes through non-object leaves.
// Preserve separable modeling metadata (Entity, ObjectTag, Flag, Fact) and constraints.
// Their metadata values are opaque: ToJson must only transform ordinary properties.
// Do not infer a general preservation rule for kinds intrinsic to another structure.
// A toJSON replacement carries the metadata of its return type, not of its input.
// Keep expected types explicit: failing assertions expose cases to review before fixing ToJson.
describe("ToJson", () => {
	it("preserves each JSON primitive", () => {
		type _CheckString = DCommon.ExpectType<DCommon.ToJson<string>, string, "strict">;
		type _CheckNumber = DCommon.ExpectType<DCommon.ToJson<number>, number, "strict">;
		type _CheckBoolean = DCommon.ExpectType<DCommon.ToJson<boolean>, boolean, "strict">;
		type _CheckNull = DCommon.ExpectType<DCommon.ToJson<null>, null, "strict">;
		type _CheckUndefined = DCommon.ExpectType<DCommon.ToJson<undefined>, undefined, "strict">;
	});

	it("preserves primitive literals and template literals", () => {
		type _CheckString = DCommon.ExpectType<DCommon.ToJson<"ready">, "ready", "strict">;
		type _CheckNumber = DCommon.ExpectType<DCommon.ToJson<42>, 42, "strict">;
		type _CheckTrue = DCommon.ExpectType<DCommon.ToJson<true>, true, "strict">;
		type _CheckFalse = DCommon.ExpectType<DCommon.ToJson<false>, false, "strict">;
		type _CheckTemplate = DCommon.ExpectType<DCommon.ToJson<`user-${number}`>, `user-${number}`, "strict">;
	});

	it("preserves never without introducing a fallback", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<never>, never, "strict">;
	});

	it("preserves unknown and any", () => {
		type _CheckUnknown = DCommon.ExpectType<DCommon.ToJson<unknown>, unknown, "strict">;
		type _CheckAny = DCommon.ExpectType<DCommon.ToJson<any>, any, "strict">;
	});

	it("passes through non-object leaves outside JsonPrimitive", () => {
		type _CheckBigInt = DCommon.ExpectType<DCommon.ToJson<bigint>, bigint, "strict">;
		type _CheckBigIntLiteral = DCommon.ExpectType<DCommon.ToJson<42n>, 42n, "strict">;
		type _CheckSymbol = DCommon.ExpectType<DCommon.ToJson<symbol>, symbol, "strict">;
		type _CheckVoid = DCommon.ExpectType<DCommon.ToJson<void>, void, "strict">;
	});

	it("distributes over unions of primitive types", () => {
		type Input = "ready" | 42 | false | null | undefined;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, Input, "strict">;
	});

	it("preserves constraints on string and number leaves", () => {
		type Name = string & DString.MinCharacters<3>;
		type Age = number & DNumber.GreaterThan<0>;
		type _CheckName = DCommon.ExpectType<DCommon.ToJson<Name>, Name, "strict">;
		type _CheckAge = DCommon.ExpectType<DCommon.ToJson<Age>, Age, "strict">;
	});

	it("preserves a primitive new type", () => {
		type UserId = string & DModeling.NewType<"UserId">;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<UserId>, UserId, "strict">;
	});

	it("preserves an empty object", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<{}>, {}, "strict">;
	});

	it("preserves the plain object used by an HTTP progress event", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<{ percent: number }>, { percent: number }, "strict">;
	});

	it("preserves readonly and optional object properties", () => {
		interface Input {
			readonly id: string;
			name: string;
			readonly age?: number;
			enabled?: boolean;
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, Input, "strict">;
	});

	it("distinguishes an optional property from a required undefined union", () => {
		interface Input {
			readonly optional?: string;
			readonly required: string | undefined;
			readonly missing: undefined;
			readonly impossible: never;
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, Input, "strict">;
	});

	it("transforms nested objects while preserving property modifiers", () => {
		type Result = DCommon.ToJson<{
			readonly user?: {
				name: string;
				readonly createdAt?: Date;
			};
		}>;
		type _CheckResult = DCommon.ExpectType<
			Result,
			{
				readonly user?: {
					name: string;
					readonly createdAt?: string;
				};
			},
			"strict"
		>;
	});

	it("transforms string index signatures", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ readonly [key: string]: Date | null }>,
			{ readonly [key: string]: string | null },
			"strict"
		>;
	});

	it("transforms numeric property keys and index signatures", () => {
		type _CheckKey = DCommon.ExpectType<DCommon.ToJson<{ 0: Date }>, { 0: string }, "strict">;
		type _CheckIndex = DCommon.ExpectType<
			DCommon.ToJson<{ [key: number]: Date }>,
			{ [key: number]: string },
			"strict"
		>;
	});

	it("distributes over discriminated object unions", () => {
		type Input = {
			readonly kind: "dated";
			value: Date;
		} | {
			readonly kind: "empty";
			value: null;
		};
		type Expected = {
			readonly kind: "dated";
			value: string;
		} | {
			readonly kind: "empty";
			value: null;
		};
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, Expected, "strict">;
	});

	it("preserves primitive branches when another union member is an object", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ value: Date } | "empty" | null | undefined>,
			{ value: string } | "empty" | null | undefined,
			"strict"
		>;
	});

	it("does not retain original property types from an object intersection", () => {
		type Input = { readonly id: number } & { readonly createdAt: Date };
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Input>,
			{
				readonly id: number;
				readonly createdAt: string;
			},
			"strict"
		>;
	});

	it("transforms a native Date through toJSON", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Date>, string, "strict">;
	});

	it("transforms DuploJS dates and times to their serialized types", () => {
		type _CheckDate = DCommon.ExpectType<DCommon.ToJson<DChrono.TheDate>, DChrono.SerializedTheDate, "strict">;
		type _CheckTime = DCommon.ExpectType<DCommon.ToJson<DChrono.TheTime>, DChrono.SerializedTheTime, "strict">;
	});

	it("uses a custom toJSON return type instead of the original properties", () => {
		interface Input {
			readonly internal: Date;
			toJSON(): "serialized";
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, "serialized", "strict">;
	});

	it("supports a callable toJSON property", () => {
		interface Input {
			// oxlint-disable-next-line typescript/method-signature-style -- Test the property syntax explicitly.
			readonly toJSON: () => 42;
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, 42, "strict">;
	});

	it("recursively transforms an object returned by toJSON", () => {
		interface Input {
			toJSON(): {
				readonly createdAt: Date;
				readonly value?: number;
			};
		}
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Input>,
			{
				readonly createdAt: string;
				readonly value?: number;
			},
			"strict"
		>;
	});

	it("recursively transforms an array returned by toJSON", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ toJSON(): Date[] }>,
			string[],
			"strict"
		>;
	});

	it("recursively transforms a tuple returned by toJSON", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ toJSON(): readonly [Date, DChrono.TheTime] }>,
			readonly [string, DChrono.SerializedTheTime],
			"strict"
		>;
	});

	it("follows multiple nested toJSON return types", () => {
		interface Input {
			toJSON(): { toJSON(): Date };
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, string, "strict">;
	});

	it("distributes over unions returned by toJSON", () => {
		interface Input {
			toJSON(): Date | { readonly value: Date } | null;
		}
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Input>,
			string | { readonly value: string } | null,
			"strict"
		>;
	});

	it("preserves special types returned by toJSON", () => {
		type _CheckNever = DCommon.ExpectType<DCommon.ToJson<{ toJSON(): never }>, never, "strict">;
		type _CheckUnknown = DCommon.ExpectType<DCommon.ToJson<{ toJSON(): unknown }>, unknown, "strict">;
		type _CheckAny = DCommon.ExpectType<DCommon.ToJson<{ toJSON(): any }>, any, "strict">;
		type _CheckUndefined = DCommon.ExpectType<DCommon.ToJson<{ toJSON(): undefined }>, undefined, "strict">;
	});

	it("treats a non-callable toJSON property as ordinary data", () => {
		interface Input {
			readonly toJSON: string;
			readonly createdAt: Date;
		}
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Input>,
			{
				readonly toJSON: string;
				readonly createdAt: string;
			},
			"strict"
		>;
	});

	it("preserves mutable and readonly empty tuples", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[]>, [], "strict">;
		type _CheckReadonly = DCommon.ExpectType<DCommon.ToJson<readonly []>, readonly [], "strict">;
	});

	it("preserves mutable and readonly arrays of primitive values", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<number[]>, number[], "strict">;
		type _CheckReadonly = DCommon.ExpectType<DCommon.ToJson<readonly number[]>, readonly number[], "strict">;
	});

	it("transforms mutable and readonly arrays of dates", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<Date[]>, string[], "strict">;
		type _CheckReadonly = DCommon.ExpectType<DCommon.ToJson<readonly Date[]>, readonly string[], "strict">;
	});

	it("transforms object values inside arrays", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ readonly createdAt: Date }[]>,
			{ readonly createdAt: string }[],
			"strict"
		>;
	});

	it("transforms unions inside nested arrays", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<readonly (Date | null | { value: Date }[])[]>,
			readonly (string | null | { value: string }[])[],
			"strict"
		>;
	});

	it("transforms all positions of a mutable tuple", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<[Date, number, { readonly value: Date }, null]>,
			[string, number, { readonly value: string }, null],
			"strict"
		>;
	});

	it("transforms all positions of a readonly tuple", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, DChrono.TheTime, number]>,
			readonly [string, DChrono.SerializedTheTime, number],
			"strict"
		>;
	});

	it("preserves optional positions in mutable and readonly tuples", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[Date, Date?]>, [string, string?], "strict">;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, Date?]>,
			readonly [string, string?],
			"strict"
		>;
	});

	it("preserves tuples containing only optional positions", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[Date?, number?]>, [string?, number?], "strict">;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date?, number?]>,
			readonly [string?, number?],
			"strict"
		>;
	});

	it("preserves variadic tuple tails", () => {
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[Date, ...Date[]]>, [string, ...string[]], "strict">;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, ...Date[]]>,
			readonly [string, ...string[]],
			"strict"
		>;
	});

	it("preserves optional positions followed by a variadic tail", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, Date?, ...Date[]]>,
			readonly [string, string?, ...string[]],
			"strict"
		>;
	});

	it("preserves required positions after a variadic prefix", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<readonly [...Date[], DChrono.TheTime]>,
			readonly [...string[], DChrono.SerializedTheTime],
			"strict"
		>;
	});

	it("distributes over unions of arrays and tuples", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Date[] | readonly [Date, null]>,
			string[] | readonly [string, null],
			"strict"
		>;
	});

	it("preserves any, unknown and never array elements", () => {
		type _CheckAny = DCommon.ExpectType<DCommon.ToJson<any[]>, any[], "strict">;
		type _CheckUnknown = DCommon.ExpectType<DCommon.ToJson<readonly unknown[]>, readonly unknown[], "strict">;
		type _CheckNever = DCommon.ExpectType<DCommon.ToJson<never[]>, never[], "strict">;
	});

	it("preserves an ignored object before inspecting its toJSON method", () => {
		interface Input {
			readonly value: Date;
			toJSON(): string;
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, Input>, Input, "strict">;
	});

	it("preserves an ignored native Date", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Date, Date>, Date, "strict">;
	});

	it("passes the ignored type through nested object properties", () => {
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{
				readonly date: Date;
				readonly time: DChrono.TheTime;
			}, Date>,
			{
				readonly date: Date;
				readonly time: DChrono.SerializedTheTime;
			},
			"strict"
		>;
	});

	it("passes the ignored type through arrays and tuples", () => {
		type _CheckArray = DCommon.ExpectType<DCommon.ToJson<Date[], Date>, Date[], "strict">;
		type _CheckTuple = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, DChrono.TheTime], Date>,
			readonly [Date, DChrono.SerializedTheTime],
			"strict"
		>;
	});

	it("passes the ignored type through a toJSON result", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<{ toJSON(): Date }, Date>, Date, "strict">;
	});

	it("ignores several types while transforming other union members", () => {
		type Ignored = Date | DChrono.TheTime;
		type Input = Ignored | { toJSON(): 42 } | null;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, Ignored>, Ignored | 42 | null, "strict">;
	});

	it("uses assignability to match an ignored type", () => {
		interface Ignored {
			readonly preserve: true;
		}
		type Input = Ignored & { readonly date: Date };
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, Ignored>, Input, "strict">;
	});

	it("stops all transformation when unknown is ignored", () => {
		type Input = { readonly date: Date } | readonly [Date] | null;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, unknown>, Input, "strict">;
	});

	it("keeps the default behavior when never is explicitly ignored", () => {
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Date, never>, string, "strict">;
	});

	it("preserves an entire ignored array without transforming its elements", () => {
		type Input = readonly Date[];
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, readonly unknown[]>, Input, "strict">;
	});

	it("preserves object constraints while transforming their properties", () => {
		type Constraint = DCommon.Constraint<"source", "verified">;
		type Input = { readonly createdAt: Date } & Constraint;
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<Input>,
			{ readonly createdAt: string } & Constraint,
			"strict"
		>;
	});

	it("preserves several object constraints without transforming their metadata", () => {
		type Constraints = DCommon.Constraint<"first", Date> & DCommon.Constraint<"second", 42>;
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & Constraints>;
		type _CheckResult = DCommon.ExpectType<
			Result,
			{ readonly createdAt: string } & Constraints,
			"strict"
		>;
		type _CheckConstraints = DCommon.ExpectType<DCommon.GetConstraint<Result>, Constraints, "strict">;
	});

	it("preserves mutable and readonly array cardinality constraints", () => {
		type Constraints = DArray.MinElements<1> & DArray.MaxElements<3>;
		type _CheckMutable = DCommon.ExpectType<
			DCommon.ToJson<Date[] & Constraints>,
			string[] & Constraints,
			"strict"
		>;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly Date[] & Constraints>,
			readonly string[] & Constraints,
			"strict"
		>;
	});

	it("preserves constraints on mutable and readonly tuples", () => {
		type Constraint = DCommon.Constraint<"pair">;
		type _CheckMutable = DCommon.ExpectType<
			DCommon.ToJson<[Date, number] & Constraint>,
			[string, number] & Constraint,
			"strict"
		>;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, number] & Constraint>,
			readonly [string, number] & Constraint,
			"strict"
		>;
	});

	it("preserves constraints on empty tuples", () => {
		type Constraint = DCommon.Constraint<"empty">;
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[] & Constraint>, [] & Constraint, "strict">;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [] & Constraint>,
			readonly [] & Constraint,
			"strict"
		>;
	});

	it("preserves a new type carried by a serialized object", () => {
		type Brand = DModeling.NewType<"Payload">;
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ readonly createdAt: Date } & Brand>,
			{ readonly createdAt: string } & Brand,
			"strict"
		>;
	});

	it("preserves entity metadata without retaining original property types", () => {
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & DModeling.Entity<"User">>;
		type Expected = { readonly createdAt: string } & DModeling.Entity<"User">;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckName = DCommon.ExpectType<DModeling.GetEntityName<Result>, "User", "strict">;
	});

	it("preserves object tag metadata without retaining original property types", () => {
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & DModeling.ObjectTag<"user">>;
		type Expected = { readonly createdAt: string } & DModeling.ObjectTag<"user">;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckTag = DCommon.ExpectType<DModeling.GetTagValue<Result>, "user", "strict">;
	});

	it("preserves entity, tag and constraint metadata together", () => {
		type Metadata = DModeling.Entity<"User"> & DModeling.ObjectTag<"user"> & DCommon.Constraint<"verified">;
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ readonly createdAt: Date } & Metadata>,
			{ readonly createdAt: string } & Metadata,
			"strict"
		>;
	});

	it("preserves a flag without serializing its payload", () => {
		interface Payload {
			readonly checkedAt: Date;
			readonly source: { toJSON(): "serialized-source" };
			toJSON(): "serialized-flag";
		}
		type Metadata = DModeling.Entity<"User"> & DModeling.Flag<"Verified", Payload>;
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & Metadata>;
		type Expected = { readonly createdAt: string } & Metadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckPayload = DCommon.ExpectType<DModeling.GetFlagPayload<Result>, Payload, "strict">;
	});

	it("preserves a fact without serializing its payload", () => {
		interface Payload {
			readonly occurredAt: Date;
			readonly source: { toJSON(): "serialized-source" };
			toJSON(): "serialized-fact";
		}
		type Metadata = DModeling.Entity<"User"> & DModeling.Fact<"UserCreated", Payload>;
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & Metadata>;
		type Expected = { readonly createdAt: string } & Metadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckName = DCommon.ExpectType<DModeling.GetFactName<Result>, "UserCreated", "strict">;
		type _CheckPayload = DCommon.ExpectType<DModeling.GetFactPayload<Result>, Payload, "strict">;
	});

	it("preserves several flags, a fact and constraints without serializing metadata values", () => {
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.ObjectTag<"user">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Flag<"Authorized", { toJSON(): "serialized-authorization" }>
			& DModeling.Fact<"UserCreated", { readonly at: Date }>
			& DCommon.Constraint<"source", Date>
		);
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & Metadata>;
		type Expected = { readonly createdAt: string } & Metadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckKinds = DCommon.ExpectType<Result[DKind.KeySymbol], Metadata[DKind.KeySymbol], "strict">;
		type _CheckConstraints = DCommon.ExpectType<DCommon.GetConstraint<Result>, DCommon.Constraint<"source", Date>, "strict">;
	});

	it("does not serialize a constraint payload even when the payload itself defines toJSON", () => {
		interface Payload {
			readonly checkedAt: Date;
			toJSON(): "serialized-constraint";
		}
		type Metadata = DCommon.Constraint<"verified", Payload>;
		type Result = DCommon.ToJson<{ readonly createdAt: Date } & Metadata>;
		type Expected = { readonly createdAt: string } & Metadata;
		type _CheckResult = DCommon.ExpectType<Result, Expected, "strict">;
		type _CheckPayload = DCommon.ExpectType<Result[DCommon.ConstraintSymbol]["verified"], Payload, "strict">;
	});

	it("preserves modeling metadata and constraints on objects whose properties do not change", () => {
		type Metadata = DModeling.Entity<"User"> & DModeling.Flag<"Verified", Date> & DCommon.Constraint<"verified">;
		type Input = { readonly value: number } & Metadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<DCommon.ToJson<Input>>,
			DCommon.SimplifyTopLevel<Input>,
			"strict"
		>;
	});

	it("preserves intersected object tags and constraints on mutable and readonly arrays", () => {
		type Metadata = DModeling.ObjectTag<"collection"> & DArray.MinElements<1>;
		type _CheckMutable = DCommon.ExpectType<
			DCommon.ToJson<Date[] & Metadata>,
			string[] & Metadata,
			"strict"
		>;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly Date[] & Metadata>,
			readonly string[] & Metadata,
			"strict"
		>;
	});

	it("preserves intersected object tags and constraints on mutable and readonly optional tuples", () => {
		type Metadata = DModeling.ObjectTag<"tuple"> & DCommon.Constraint<"pair">;
		type _CheckMutable = DCommon.ExpectType<
			DCommon.ToJson<[Date, Date?] & Metadata>,
			[string, string?] & Metadata,
			"strict"
		>;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [Date, Date?] & Metadata>,
			readonly [string, string?] & Metadata,
			"strict"
		>;
	});

	it("preserves intersected object tags and constraints on empty tuples", () => {
		type Metadata = DModeling.ObjectTag<"tuple"> & DCommon.Constraint<"empty">;
		type _CheckMutable = DCommon.ExpectType<DCommon.ToJson<[] & Metadata>, [] & Metadata, "strict">;
		type _CheckReadonly = DCommon.ExpectType<
			DCommon.ToJson<readonly [] & Metadata>,
			readonly [] & Metadata,
			"strict"
		>;
	});

	it("preserves modeling metadata and constraints independently on nested containers", () => {
		type ParentMetadata = DModeling.Entity<"Parent"> & DModeling.Flag<"Verified", Date> & DCommon.Constraint<"parent">;
		type ChildMetadata = (
			& DModeling.ObjectTag<"child">
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"child">
		);
		type InputChild = { readonly createdAt: Date } & ChildMetadata;
		type ExpectedChild = { readonly createdAt: string } & ChildMetadata;
		type Result = DCommon.ToJson<{ readonly child?: InputChild } & ParentMetadata>;
		type _CheckChild = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<NonNullable<Result["child"]>>,
			DCommon.SimplifyTopLevel<ExpectedChild>,
			"strict"
		>;
		type _CheckParentKinds = DCommon.ExpectType<Result[DKind.KeySymbol], ParentMetadata[DKind.KeySymbol], "strict">;
		type _CheckParentConstraints = DCommon.ExpectType<
			DCommon.GetConstraint<Result>,
			DCommon.Constraint<"parent">,
			"strict"
		>;
	});

	it("does not reattach input metadata to a custom toJSON result", () => {
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"verified">
		);
		type Input = { toJSON(): "serialized" } & Metadata;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, "serialized", "strict">;
	});

	it("does not reattach input kinds or constraints to a serialized Date", () => {
		type Input = Date & DModeling.ObjectTag<"date"> & DCommon.Constraint<"verified">;
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input>, string, "strict">;
	});

	it("keeps parent metadata when a nested toJSON value loses its own metadata", () => {
		type ParentMetadata = DModeling.Entity<"Parent"> & DModeling.Flag<"Verified", Date> & DCommon.Constraint<"parent">;
		type ChildMetadata = DModeling.ObjectTag<"child"> & DCommon.Constraint<"child">;
		type Child = { toJSON(): "serialized" } & ChildMetadata;
		type Result = DCommon.ToJson<{ readonly child: Child } & ParentMetadata>;
		type Expected = { readonly child: "serialized" } & ParentMetadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves metadata carried by the object returned by toJSON", () => {
		type Metadata = (
			& DModeling.ObjectTag<"payload">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"verified">
		);
		type Payload = { readonly date: Date } & Metadata;
		type Result = DCommon.ToJson<{ toJSON(): Payload }>;
		type Expected = { readonly date: string } & Metadata;
		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves metadata carried by an array returned by toJSON", () => {
		type Metadata = DModeling.ObjectTag<"collection"> & DArray.MinElements<1>;
		type _CheckResult = DCommon.ExpectType<
			DCommon.ToJson<{ toJSON(): readonly Date[] & Metadata }>,
			readonly string[] & Metadata,
			"strict"
		>;
	});

	it("transforms recursive optional object properties", () => {
		interface Node {
			readonly createdAt: Date;
			readonly next?: Node;
		}
		interface ExpectedNode {
			readonly createdAt: string;
			readonly next?: ExpectedNode;
		}
		type Result = DCommon.ToJson<Node>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<
			NonNullable<NonNullable<Result["next"]>["next"]>["createdAt"],
			string,
			"strict"
		>;
	});

	it("transforms recursive mutable arrays", () => {
		interface Node {
			createdAt: Date;
			children: Node[];
		}
		interface ExpectedNode {
			createdAt: string;
			children: ExpectedNode[];
		}
		type Result = DCommon.ToJson<Node>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<Result["children"][number]["createdAt"], string, "strict">;
	});

	it("transforms recursive readonly arrays", () => {
		interface Node {
			readonly createdAt: Date;
			readonly children: readonly Node[];
		}
		interface ExpectedNode {
			readonly createdAt: string;
			readonly children: readonly ExpectedNode[];
		}
		type Result = DCommon.ToJson<Node>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<Result["children"][number]["createdAt"], string, "strict">;
	});

	it("transforms mutually recursive objects", () => {
		interface First {
			readonly second: Second;
		}
		interface Second {
			readonly first?: First;
			readonly createdAt: Date;
		}
		interface ExpectedFirst {
			readonly second: ExpectedSecond;
		}
		interface ExpectedSecond {
			readonly first?: ExpectedFirst;
			readonly createdAt: string;
		}
		type Result = DCommon.ToJson<First>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedFirst, "strict">;
		type _CheckNested = DCommon.ExpectType<
			NonNullable<Result["second"]["first"]>["second"]["createdAt"],
			string,
			"strict"
		>;
	});

	it("transforms tuples and nullable branches inside recursive objects", () => {
		interface Node {
			readonly entry: readonly [Date, Node | null];
		}
		interface ExpectedNode {
			readonly entry: readonly [string, ExpectedNode | null];
		}
		type Result = DCommon.ToJson<Node>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<NonNullable<Result["entry"][1]>["entry"][0], string, "strict">;
	});

	it("preserves modeling metadata and constraints in recursive objects", () => {
		type Metadata = (
			& DModeling.Entity<"Node">
			& DModeling.ObjectTag<"node">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"verified">
		);
		type Node = {
			readonly createdAt: Date;
			readonly children: readonly Node[] & DArray.MinElements<1>;
		} & Metadata;
		type ExpectedNode = {
			readonly createdAt: string;
			readonly children: readonly ExpectedNode[] & DArray.MinElements<1>;
		} & Metadata;
		type Result = DCommon.ToJson<Node>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<Result["children"][number]["createdAt"], string, "strict">;
		type _CheckName = DCommon.ExpectType<DModeling.GetEntityName<Result>, "Node", "strict">;
		type _CheckTag = DCommon.ExpectType<DModeling.GetTagValue<Result>, "node", "strict">;
		type _CheckKinds = DCommon.ExpectType<Result[DKind.KeySymbol], Metadata[DKind.KeySymbol], "strict">;
	});

	it("preserves an already JSON-shaped recursive object", () => {
		interface Node {
			readonly value: number;
			readonly next?: Node;
			readonly children: readonly Node[];
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Node>, Node, "strict">;
	});

	describe("recursive output constraints", () => {
		it("accepts a finite array in a recursively constrained container", () => {
			type Value = string | Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type Result = Container<DCommon.ToJson<string[][]>>;

			type _CheckResult = DCommon.ExpectType<Result, string[][], "strict">;
		});

		it("serializes a generic recursive value without a constrained output container", () => {
			type Value = string | Value[];
			type Serialize<GenericValue extends Value> = DCommon.ToJson<GenericValue>;

			type _CheckResult = DCommon.ExpectType<Serialize<string[][]>, string[][], "strict">;
		});

		it("accepts a generic non-recursive array in a constrained container", () => {
			type Value = string | string[];
			type Container<GenericValue extends Value> = GenericValue;
			type Serialize<GenericValue extends Value> = Container<DCommon.ToJson<GenericValue>>;

			type _CheckResult = DCommon.ExpectType<Serialize<string[]>, string[], "strict">;
		});

		it("accepts a generic recursive record without recursive arrays", () => {
			type Value = string | { [key: string]: Value };
			type Container<GenericValue extends Record<string, Value>> = GenericValue;
			type Serialize<GenericValue extends Record<string, Value>> = Container<DCommon.ToJson<GenericValue>>;

			type _CheckResult = DCommon.ExpectType<
				Serialize<{ readonly nested: { readonly value: string } }>,
				{ readonly nested: { readonly value: string } },
				"strict"
			>;
		});

		// Keep these declarations unsuppressed: they must compile once the regression is fixed.
		it("accepts a concrete recursive array in a constrained container", () => {
			type Value = string | Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type Result = Container<DCommon.ToJson<Value>>;

			type _CheckResult = DCommon.ExpectType<Result, Value, "strict">;
		});

		// The concrete input is finite; TS2589 occurs while checking the generic output constraint.
		it("accepts a generic recursive mutable array in a constrained container", () => {
			type Value = string | Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type Serialize<GenericValue extends Value> = Container<DCommon.ToJson<GenericValue>>;

			type _CheckResult = DCommon.ExpectType<Serialize<string[][]>, string[][], "strict">;
		});

		it("accepts a generic recursive readonly array in a constrained container", () => {
			type Value = string | readonly Value[];
			type Container<GenericValue extends Value> = GenericValue;
			type Serialize<GenericValue extends Value> = Container<DCommon.ToJson<GenericValue>>;

			type _CheckResult = DCommon.ExpectType<Serialize<readonly (readonly string[])[]>, readonly (readonly string[])[], "strict">;
		});

		it("rebuilds an inferred TheFormData with serialized values as the HTTP client does", () => {
			type Serialize<GenericInput> = GenericInput extends DCommon.TheFormData<infer InferredValues>
				? DCommon.TheFormData<DCommon.ToJson<InferredValues, File | DChrono.TheDate | DChrono.TheTime>>
				: never;
			type Input = DCommon.TheFormData<{
				readonly file: File;
				readonly date: DChrono.TheDate;
				readonly time: DChrono.TheTime;
				readonly nested: { readonly values: string[] };
			}>;
			type Result = Serialize<Input>;

			type _CheckResult = DCommon.ExpectType<Result["inputValues"], Input["inputValues"], "strict">;
		});
	});

	it("propagates an ignored type through recursive objects", () => {
		interface Node {
			readonly date: Date;
			readonly time: DChrono.TheTime;
			readonly next?: Node;
		}
		interface ExpectedNode {
			readonly date: Date;
			readonly time: DChrono.SerializedTheTime;
			readonly next?: ExpectedNode;
		}
		type Result = DCommon.ToJson<Node, Date>;
		type _CheckResult = DCommon.ExpectType<Result, ExpectedNode, "strict">;
		type _CheckNested = DCommon.ExpectType<NonNullable<Result["next"]>["date"], Date, "strict">;
	});

	it("does not traverse an ignored recursive object", () => {
		interface Node {
			readonly createdAt: Date;
			readonly next: Node;
		}
		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Node, Node>, Node, "strict">;
	});

	it("serializes an ordinary property while keeping the same type opaque inside annotations", () => {
		interface Payload {
			readonly at: Date;
			toJSON(): "serialized";
		}
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Payload>
			& DModeling.Fact<"Created", Payload>
			& DCommon.Constraint<"source", Payload>
		);
		type Result = DCommon.ToJson<{ readonly payload: Payload } & Metadata>;
		type Expected = { readonly payload: "serialized" } & Metadata;

		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckFlagPayload = DCommon.ExpectType<DModeling.GetFlagPayload<Result>, Payload, "strict">;
		type _CheckFactPayload = DCommon.ExpectType<DModeling.GetFactPayload<Result>, Payload, "strict">;
		type _CheckConstraintPayload = DCommon.ExpectType<Result[DCommon.ConstraintSymbol]["source"], Payload, "strict">;
	});

	it("preserves annotations and constraints on array elements while serializing ordinary properties", () => {
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"source", Date>
		);
		type Input = { readonly createdAt: Date } & Metadata;
		type Expected = { readonly createdAt: string } & Metadata;
		type MutableResult = DCommon.ToJson<Input[]>;
		type ReadonlyResult = DCommon.ToJson<readonly Input[]>;

		type _CheckMutableElement = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<MutableResult[number]>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
		type _CheckReadonlyElement = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<ReadonlyResult[number]>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves fact discrimination and payloads across serialized union members", () => {
		type Created = { readonly at: Date } & DModeling.Entity<"User"> & DModeling.Fact<"Created", { at: Date }>;
		type Deleted = { readonly at: Date } & DModeling.Entity<"User"> & DModeling.Fact<"Deleted", { reason: string }>;
		type Result = DCommon.ToJson<Created | Deleted>;
		type CreatedResult = Extract<Result, DModeling.Fact<"Created">>;
		type DeletedResult = Extract<Result, DModeling.Fact<"Deleted">>;

		type _CheckCreatedAt = DCommon.ExpectType<CreatedResult["at"], string, "strict">;
		type _CheckDeletedAt = DCommon.ExpectType<DeletedResult["at"], string, "strict">;
		type _CheckCreatedPayload = DCommon.ExpectType<DModeling.GetFactPayload<CreatedResult>, { at: Date }, "strict">;
		type _CheckDeletedPayload = DCommon.ExpectType<DModeling.GetFactPayload<DeletedResult>, { reason: string }, "strict">;
	});

	it("preserves flag discrimination across serialized union members", () => {
		type First = { readonly at: Date } & DModeling.Entity<"User"> & DModeling.Flag<"State", "first">;
		type Second = { readonly at: null } & DModeling.Entity<"User"> & DModeling.Flag<"State", "second">;
		type Result = DCommon.ToJson<First | Second>;

		type _CheckFirst = DCommon.ExpectType<Extract<Result, DModeling.Flag<"State", "first">>["at"], string, "strict">;
		type _CheckSecond = DCommon.ExpectType<Extract<Result, DModeling.Flag<"State", "second">>["at"], null, "strict">;
	});

	it("preserves recursive annotation payloads without attempting to serialize them", () => {
		interface Payload {
			readonly at: Date;
			readonly next?: Payload;
			toJSON(): "serialized-payload";
		}
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.Flag<"Verified", Payload>
			& DModeling.Fact<"Created", Payload>
			& DCommon.Constraint<"source", Payload>
		);
		type Result = DCommon.ToJson<{ readonly at: Date } & Metadata>;
		type Expected = { readonly at: string } & Metadata;

		type _CheckResult = DCommon.ExpectType<
			DCommon.SimplifyTopLevel<Result>,
			DCommon.SimplifyTopLevel<Expected>,
			"strict"
		>;
	});

	it("preserves all annotation metadata on an ignored object", () => {
		type Metadata = (
			& DModeling.Entity<"User">
			& DModeling.ObjectTag<"user">
			& DModeling.Flag<"Verified", Date>
			& DModeling.Fact<"Created", { readonly at: Date }>
			& DCommon.Constraint<"source", Date>
		);
		type Input = {
			readonly at: Date;
			toJSON(): "serialized";
		} & Metadata;

		type _CheckResult = DCommon.ExpectType<DCommon.ToJson<Input, Input>, Input, "strict">;
	});
});
