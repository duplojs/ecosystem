import { DKind, type ExpectType } from "@scripts";

describe("parentClass", () => {
	it("creates a class from a kind name", () => {
		const KindClass = DKind.parentClass<"class-kind">("class-kind");
		const kind = DKind.create<"class-kind">("class-kind");
		const instance = new KindClass<"value">("value");

		type _CheckInstance = ExpectType<
			typeof instance,
			DKind.Kind<DKind.Handler<DKind.Definition<"class-kind">>, "value">,
			"strict"
		>;

		expect(instance).toBeInstanceOf(KindClass);
		expect(kind.has(instance)).toBe(true);
		expect(kind.getValue(instance)).toBe("value");
	});

	it("extends a parent class and keeps its runtime behavior", () => {
		const kind = DKind.create<"child-class", number>("child-class");

		class Parent {
			public static readonly label = "parent";

			public constructor(
				public readonly name: string,
			) {}

			public getName() {
				return this.name;
			}
		}

		const KindClass = DKind.parentClass(kind, Parent);
		const instance = new KindClass(12, "John");

		type _CheckInstance = ExpectType<
			typeof instance,
			& Parent
			& DKind.Kind<typeof kind, 12>,
			"strict"
		>;

		expect(KindClass.label).toBe("parent");
		expect(instance).toBeInstanceOf(Parent);
		expect(instance).toBeInstanceOf(KindClass);
		expect(instance.getName()).toBe("John");
		expect(kind.getValue(instance)).toBe(12);
		expect({}).not.toBeInstanceOf(KindClass);
	});
});
