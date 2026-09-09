import { DCommon, type ExpectType } from "@scripts";

describe("createExternalPromise", () => {
	it("resolves the promise from the exposed resolver", async() => {
		const externalPromise = DCommon.createExternalPromise<"done">();

		type _CheckPromise = ExpectType<
			typeof externalPromise.promise,
			Promise<"done">,
			"strict"
		>;

		externalPromise.resolve("done");

		await expect(externalPromise.promise).resolves.toBe("done");
	});

	it("rejects the promise from the exposed rejecter", async() => {
		const externalPromise = DCommon.createExternalPromise<string>();
		const error = new Error("failed");

		externalPromise.reject(error);

		await expect(externalPromise.promise).rejects.toBe(error);
	});

	it("awaits promise values passed to the resolver", async() => {
		const externalPromise = DCommon.createExternalPromise<string>();

		externalPromise.resolve(Promise.resolve("done"));

		await expect(externalPromise.promise).resolves.toBe("done");
	});
});
