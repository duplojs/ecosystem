import { createHookRouteLifeCycle } from "@core";

describe("hookRouteLifeCycle", () => {
	it("createHookRouteLifeCycle", () => {
		expect(
			createHookRouteLifeCycle({
				afterSendResponse: ({ exit }) => exit(),
			}),
		).toStrictEqual({
			afterSendResponse: expect.any(Function),
		});
	});
});
