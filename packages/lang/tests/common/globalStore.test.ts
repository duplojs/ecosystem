import * as DCommon from "@scripts/common";

declare module "@scripts" {
	interface GlobalStore {
		testStore: "test" | "toto";
	}
}

it("globalStore", () => {
	const myStore = DCommon.createGlobalStore("testStore", "test");

	expect(myStore.value).toBe("test");

	type Check = DCommon.ExpectType<
		typeof myStore.value,
		"test" | "toto",
		"strict"
	>;

	myStore.set("toto");

	expect(myStore.value).toBe("toto");

	const myCloneStore = DCommon.createGlobalStore("testStore", "test");

	expect(myCloneStore.value).toBe("toto");
});
