import { DInvocation, type ExpectType } from "@scripts";

describe("createReader", () => {
	it("should create a reader handler with injected ports", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const dependencies = {
			UserRepository,
		};
		const getUserNameReader = DInvocation.createReader(
			dependencies,
			({ userRepository }) => {
				type _CheckUserRepository = ExpectType<
					typeof userRepository,
					UserRepository,
					"strict"
				>;

				return (id: string) => userRepository.findName(id);
			},
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const getUserName = getUserNameReader.run({ userRepository });

		expect(DInvocation.readerKind.has(getUserNameReader)).toBe(true);
		expect(getUserNameReader.dependencies).toBe(dependencies);
		expect(getUserName("42")).toBe("user-42");

		type _CheckReader = ExpectType<
			typeof getUserNameReader,
			DInvocation.Reader<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});

	it("should accept any reader value", () => {
		const valueReader = DInvocation.createReader(
			{},
			() => 42 as const,
		);
		const value = valueReader.run({});

		expect(value).toBe(42);

		type _CheckValue = ExpectType<
			typeof value,
			42,
			"strict"
		>;
	});

	it("should inject nested readers and allow explicit reader injection", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const getUserNameReader = DInvocation.createReader(
			{ UserRepository },
			({ userRepository }) => (id: string) => userRepository.findName(id),
		);
		const dependencies = {
			GetUserName: getUserNameReader,
		};
		const welcomeUserReader = DInvocation.createReader(
			dependencies,
			({ getUserName }) => (id: string) => `Welcome ${getUserName(id)}`,
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const welcomeUser = welcomeUserReader.run({ userRepository });
		const injectedGetUserName = (id: string) => `injected-${id}`;
		const welcomeInjectedUser = welcomeUserReader.run({
			getUserName: injectedGetUserName,
			userRepository,
		});

		expect(welcomeUser("42")).toBe("Welcome user-42");
		expect(welcomeInjectedUser("42")).toBe("Welcome injected-42");

		type _CheckWelcomeUserReader = ExpectType<
			typeof welcomeUserReader,
			DInvocation.Reader<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});
});

describe("resolveReaders", () => {
	it("should resolve readers with shared ports", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepository = DInvocation.createPort<UserRepository>();
		const getUserNameReader = DInvocation.createReader(
			{ UserRepository },
			({ userRepository }) => (id: string) => userRepository.findName(id),
		);
		const welcomeUserReader = DInvocation.createReader(
			{ GetUserName: getUserNameReader },
			({ getUserName }) => (id: string) => `Welcome ${getUserName(id)}`,
		);
		const statusReader = DInvocation.createReader(
			{},
			() => "ready" as const,
		);
		const userRepository = UserRepository.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const readers = DInvocation.resolveReaders(
			{
				GetUserName: getUserNameReader,
				WelcomeUser: welcomeUserReader,
				Status: statusReader,
			},
			{ userRepository },
		);

		expect(readers.getUserName("42")).toBe("user-42");
		expect(readers.welcomeUser("42")).toBe("Welcome user-42");
		expect(readers.status).toBe("ready");

		type _CheckReaders = ExpectType<
			typeof readers,
			{
				getUserName(id: string): string;
				welcomeUser(id: string): string;
				status: "ready";
			},
			"strict"
		>;
	});
});
