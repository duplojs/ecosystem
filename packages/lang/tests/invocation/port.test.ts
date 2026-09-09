import { DInvocation, type ExpectType } from "@scripts";

describe("createPort", () => {
	it("should create a port handler that returns its implementation", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const implementation = {
			findName: (id: string) => `user-${id}`,
		};
		const result = UserRepository.createImplementation(implementation);

		expect(DInvocation.portHandlerKind.has(UserRepository)).toBe(true);
		expect(result).toBe(implementation);
		expect(result.findName("42")).toBe("user-42");

		type _CheckPort = ExpectType<
			typeof UserRepository,
			DInvocation.PortHandler<UserRepository>,
			"strict"
		>;

		type _CheckResult = ExpectType<
			typeof result,
			UserRepository,
			"strict"
		>;
	});
});
