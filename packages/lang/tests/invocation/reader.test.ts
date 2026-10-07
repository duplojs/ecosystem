import * as DInvocation from "@scripts/invocation";
import type * as DCommon from "@scripts/common";

describe("createReader", () => {
	it("should uncapitalize port names and remove their trailing Port suffix", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepositoryPort = DInvocation.createPort<UserRepository>();
		const dependencies = {
			UserRepositoryPort,
		};
		const getUserNameReader = DInvocation.createReader(
			dependencies,
			({ userRepository }) => {
				type _CheckUserRepository = DCommon.ExpectType<
					typeof userRepository,
					UserRepository,
					"strict"
				>;

				return (id: string) => userRepository.findName(id);
			},
		);
		const userRepository = UserRepositoryPort.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const getUserName = getUserNameReader.run({ userRepository });

		expect(DInvocation.readerKind.has(getUserNameReader)).toBe(true);
		expect(getUserNameReader.dependencies).toBe(dependencies);
		expect(getUserName("42")).toBe("user-42");

		type _CheckReader = DCommon.ExpectType<
			typeof getUserNameReader,
			DInvocation.Reader<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});

	it("should preserve port names without an exact trailing Port suffix", () => {
		const ValuePort = DInvocation.createPort<number>();
		const dependencies = {
			Value: ValuePort,
			Lowercaseport: ValuePort,
			UppercasePORT: ValuePort,
			PortValue: ValuePort,
			RepeatedPortPort: ValuePort,
			alreadyFormattedPort: ValuePort,
		};
		const valueReader = DInvocation.createReader(
			dependencies,
			(values) => {
				type _CheckValues = DCommon.ExpectType<
					typeof values,
					{
						value: number;
						lowercaseport: number;
						uppercasePORT: number;
						portValue: number;
						repeatedPort: number;
						alreadyFormatted: number;
					},
					"strict"
				>;

				return values;
			},
		);
		const values = {
			value: 1,
			lowercaseport: 2,
			uppercasePORT: 3,
			portValue: 4,
			repeatedPort: 5,
			alreadyFormatted: 6,
		};

		expect(valueReader.run(values)).toStrictEqual(values);

		type _CheckPorts = DCommon.ExpectType<
			Parameters<typeof valueReader.run>[0],
			typeof values,
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

		type _CheckValue = DCommon.ExpectType<
			typeof value,
			42,
			"strict"
		>;
	});

	it("should uncapitalize nested reader names, preserve their Port suffix and allow explicit injection", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepositoryPort = DInvocation.createPort<UserRepository>();
		const getUserNameReader = DInvocation.createReader(
			{ UserRepositoryPort },
			({ userRepository }) => (id: string) => userRepository.findName(id),
		);
		const dependencies = {
			GetUserNamePort: getUserNameReader,
		};
		const welcomeUserReader = DInvocation.createReader(
			dependencies,
			({ getUserNamePort }) => {
				type _CheckGetUserNamePort = DCommon.ExpectType<
					typeof getUserNamePort,
					(id: string) => string,
					"strict"
				>;

				return (id: string) => `Welcome ${getUserNamePort(id)}`;
			},
		);
		const userRepository = UserRepositoryPort.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const welcomeUser = welcomeUserReader.run({ userRepository });
		const injectedGetUserName = (id: string) => `injected-${id}`;
		const welcomeInjectedUser = welcomeUserReader.run({
			getUserNamePort: injectedGetUserName,
			userRepository,
		});

		expect(welcomeUser("42")).toBe("Welcome user-42");
		expect(welcomeInjectedUser("42")).toBe("Welcome injected-42");

		type _CheckInjectedDependencies = DCommon.ExpectType<
			Parameters<typeof welcomeUserReader.run>[0],
			{
				userRepository: UserRepository;
				getUserNamePort?(id: string): string;
			},
			"strict"
		>;

		type _CheckWelcomeUserReader = DCommon.ExpectType<
			typeof welcomeUserReader,
			DInvocation.Reader<
				typeof dependencies,
				(id: string) => string
			>,
			"strict"
		>;
	});

	it("should format ports and readers differently in the same dependencies", () => {
		const ValuePort = DInvocation.createPort<number>();
		const valueReader = DInvocation.createReader({}, () => "reader" as const);
		const dependencies = {
			ValuePort,
			ReadValuePort: valueReader,
			ReadValue: valueReader,
			alreadyFormattedPort: valueReader,
			URLPort: valueReader,
		};
		const reader = DInvocation.createReader(
			dependencies,
			(values) => {
				type _CheckValues = DCommon.ExpectType<
					typeof values,
					{
						value: number;
						readValuePort: "reader";
						readValue: "reader";
						alreadyFormattedPort: "reader";
						uRLPort: "reader";
					},
					"strict"
				>;

				return values;
			},
		);

		expect(reader.run({ value: 42 })).toStrictEqual({
			value: 42,
			readValuePort: "reader",
			readValue: "reader",
			alreadyFormattedPort: "reader",
			uRLPort: "reader",
		});
	});
});

describe("resolveReaders", () => {
	it("should resolve shared ports and uncapitalize reader names while preserving their Port suffix", () => {
		interface UserRepository {
			findName(id: string): string;
		}

		const UserRepositoryPort = DInvocation.createPort<UserRepository>();
		const getUserNameReader = DInvocation.createReader(
			{ UserRepositoryPort },
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
		const userRepository = UserRepositoryPort.createImplementation({
			findName: (id) => `user-${id}`,
		});
		const readers = DInvocation.resolveReaders(
			{
				GetUserNamePort: getUserNameReader,
				WelcomeUser: welcomeUserReader,
				Status: statusReader,
			},
			{ userRepository },
		);

		expect(readers.getUserNamePort("42")).toBe("user-42");
		expect(readers.welcomeUser("42")).toBe("Welcome user-42");
		expect(readers.status).toBe("ready");

		type _CheckReaders = DCommon.ExpectType<
			typeof readers,
			{
				getUserNamePort(id: string): string;
				welcomeUser(id: string): string;
				status: "ready";
			},
			"strict"
		>;
	});
});
