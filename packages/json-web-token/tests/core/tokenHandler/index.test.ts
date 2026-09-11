import type * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { Cipher, Signer, TokenHandlerCreateError, TokenHandlerWrongConfig, createTokenHandler } from "@scripts";

describe("createTokenHandler", () => {
	const IssuedAt = DChrono.createDateOrThrow({ value: "2023-11-14" });
	const ExpiredAt = DChrono.createDateOrThrow({ value: "2023-11-15" });
	const AccessMaxAge = DChrono.createTimeOrThrow(15 * 60 * 1000);
	const OneSecond = DChrono.createTimeOrThrow(1000);
	const ExpectedIssuedAt = Math.floor(DChrono.toTimestamp(IssuedAt) / 1000);
	const ExpectedAccessExpiration = ExpectedIssuedAt + (15 * 60);

	const createTestSigner = Signer.factory(
		"TEST-SIGNER",
		(params: { secret: string }, algorithm) => ({
			sign: (content) => Buffer
				.from(`${algorithm}:${params.secret}:${content}`)
				.toString("base64url"),
			verify: (content, signature) => signature === Buffer
				.from(`${algorithm}:${params.secret}:${content}`)
				.toString("base64url"),
		}),
	);

	const createTestCipher = Cipher.factory(
		"TEST-CIPHER",
		(params: { prefix: string }) => ({
			encrypt: (token) => `${params.prefix}:${token}`,
			decrypt: (token) => token.slice(`${params.prefix}:`.length),
		}),
	);

	const accessTokenHandler = createTokenHandler({
		maxAge: AccessMaxAge,
		now: () => IssuedAt,
		signer: createTestSigner({ secret: "access-secret" }),
		issuer: "api",
		audience: ["web", "mobile"],
		subject: "access",
		customPayloadShape: {
			userId: DDataStructure.string(),
			role: DDataStructure.union([
				DDataStructure.literal("admin"),
				DDataStructure.literal("user"),
			]),
		},
		customHeaderShape: {
			kid: DDataStructure.string(),
		},
	});

	it("creates a signed token with default claims and custom header", async() => {
		type CreatePayload = Parameters<typeof accessTokenHandler.create>[0];
		type CreateParams = NonNullable<Parameters<typeof accessTokenHandler.create>[1]>;
		type CheckCreatePayload = DCommon.ExpectType<
			CreatePayload,
			{
				readonly userId: string;
				readonly role: "admin" | "user";
			},
			"strict"
		>;
		type CheckCreateHeader = DCommon.ExpectType<
			CreateParams["header"],
			{
				readonly kid: string;
			},
			"strict"
		>;

		const result = await accessTokenHandler.create(
			{
				userId: "user-1",
				role: "admin",
			},
			{
				header: {
					kid: "main-key",
				},
			},
		);

		expect(DEither.hasInformation(result, "token-created")).toBe(true);

		const token = DEither.unwrapRightOrThrow(result);
		const [encodedHeader, encodedPayload, signature] = token.split(".");
		const header = JSON.parse(Buffer.from(encodedHeader!, "base64url").toString());
		const payload = JSON.parse(Buffer.from(encodedPayload!, "base64url").toString());

		expect(header).toStrictEqual({
			typ: "JWT",
			alg: "TEST-SIGNER",
			kid: "main-key",
		});
		expect(payload).toStrictEqual({
			iss: "api",
			sub: "access",
			aud: ["web", "mobile"],
			iat: ExpectedIssuedAt,
			exp: ExpectedAccessExpiration,
			userId: "user-1",
			role: "admin",
		});
		expect(signature).toBe(Buffer
			.from(`TEST-SIGNER:access-secret:${encodedHeader}.${encodedPayload}`)
			.toString("base64url"));
	});

	it("decodes a token and keeps output inference for payload and header", async() => {
		const token = await accessTokenHandler.createOrThrow(
			{
				userId: "user-2",
				role: "user",
			},
			{
				header: {
					kid: "secondary-key",
				},
			},
		);

		const result = await accessTokenHandler.decode(token);

		type DecodeResult = Awaited<ReturnType<typeof accessTokenHandler.decode>>;
		type DecodedToken = Extract<DecodeResult, DEither.Right>;
		type CheckPayloadUserId = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["userId"],
			string,
			"strict"
		>;
		type CheckPayloadRole = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["role"],
			"admin" | "user",
			"strict"
		>;
		type CheckPayloadIssuer = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["iss"],
			string,
			"strict"
		>;
		type CheckPayloadAudience = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["aud"],
			string[],
			"strict"
		>;
		type CheckHeader = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["header"],
			{
				readonly typ: "JWT";
				readonly alg: "TEST-SIGNER";
				readonly kid: string;
			},
			"strict"
		>;

		expect(DEither.hasInformation(result, "token-decoded")).toBe(true);

		const decodedToken = DEither.unwrapRightOrThrow(result);

		expect(decodedToken.payload.userId).toBe("user-2");
		expect(decodedToken.header.kid).toBe("secondary-key");
	});

	it("verifies a valid token", async() => {
		const token = await accessTokenHandler.createOrThrow(
			{
				userId: "user-3",
				role: "admin",
			},
			{
				header: {
					kid: "main-key",
				},
			},
		);

		const result = await accessTokenHandler.verify(token);

		type VerifyResult = Awaited<ReturnType<typeof accessTokenHandler.verify>>;
		type VerifiedToken = Extract<VerifyResult, DEither.Right>;
		type CheckVerifiedRole = DCommon.ExpectType<
			DEither.GetValue<VerifiedToken>["payload"]["role"],
			"admin" | "user",
			"strict"
		>;

		expect(DEither.hasInformation(result, "token-verified")).toBe(true);
		expect(DEither.unwrapRightOrThrow(result).payload.role).toBe("admin");
	});

	it("returns signature-invalid when the token signature does not match", async() => {
		const token = await accessTokenHandler.createOrThrow(
			{
				userId: "user-4",
				role: "user",
			},
			{
				header: {
					kid: "main-key",
				},
			},
		);
		const [header, payload] = token.split(".");
		const tamperedToken = `${header}.${payload}.${Buffer.from("bad-signature").toString("base64url")}`;

		const result = await accessTokenHandler.verify(tamperedToken);

		expect(DEither.hasInformation(result, "signature-invalid")).toBe(true);
	});

	it("returns audience-invalid when expected audience is absent from the token", async() => {
		const adminTokenHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			issuer: "api",
			audience: "admin",
			subject: "access",
			customPayloadShape: {
				userId: DDataStructure.string(),
				role: DDataStructure.literal("admin"),
			},
			customHeaderShape: {
				kid: DDataStructure.string(),
			},
		});
		const token = await accessTokenHandler.createOrThrow(
			{
				userId: "user-5",
				role: "admin",
			},
			{
				header: {
					kid: "main-key",
				},
			},
		);

		const result = await adminTokenHandler.verify(token);

		expect(DEither.hasInformation(result, "audience-invalid")).toBe(true);
	});

	it("returns expired when the token lifetime is over", async() => {
		let now = IssuedAt;
		const tokenHandler = createTokenHandler({
			maxAge: OneSecond,
			now: () => now,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});
		const token = await tokenHandler.createOrThrow({
			userId: "user-6",
		});

		now = ExpiredAt;
		const result = await tokenHandler.verify(token);

		expect(DEither.hasInformation(result, "expired")).toBe(true);
	});

	it("supports signer and cipher creators without changing method inputs", async() => {
		const tokenHandler = createTokenHandler({
			maxAge: DChrono.createTimeOrThrow(5 * 60 * 1000),
			now: () => IssuedAt,
			signer: createTestSigner,
			cipher: createTestCipher,
			customPayloadShape: {
				sessionId: DDataStructure.string(),
			},
		});

		type CreatePayload = Parameters<typeof tokenHandler.createOrThrow>[0];
		type CreateParams = Parameters<typeof tokenHandler.createOrThrow>[1];
		type VerifyParams = Parameters<typeof tokenHandler.verify>[1];
		type DecodeParams = Parameters<typeof tokenHandler.decode>[1];
		type CheckCreatePayload = DCommon.ExpectType<
			CreatePayload,
			{
				readonly sessionId: string;
			},
			"strict"
		>;
		type CheckCreateSignerParams = DCommon.ExpectType<
			CreateParams["signer"],
			{
				secret: string;
			},
			"strict"
		>;
		type CheckCreateCipherParams = DCommon.ExpectType<
			CreateParams["cipher"],
			{
				prefix: string;
			},
			"strict"
		>;
		type CheckVerifySignerParams = DCommon.ExpectType<
			VerifyParams["signer"],
			{
				secret: string;
			},
			"strict"
		>;
		type CheckVerifyCipherParams = DCommon.ExpectType<
			VerifyParams["cipher"],
			{
				prefix: string;
			},
			"strict"
		>;
		type CheckVerifyTolerance = DCommon.ExpectType<
			VerifyParams["tolerance"],
			DChrono.TheTime | undefined,
			"strict"
		>;
		type CheckDecodeParams = DCommon.ExpectType<
			DecodeParams,
			{
				cipher: {
					prefix: string;
				};
			},
			"strict"
		>;

		const token = await tokenHandler.createOrThrow(
			{
				sessionId: "session-1",
			},
			{
				signer: {
					secret: "session-secret",
				},
				cipher: {
					prefix: "encrypted",
				},
			},
		);
		const verifyResult = await tokenHandler.verify(token, {
			signer: {
				secret: "session-secret",
			},
			cipher: {
				prefix: "encrypted",
			},
		});
		const decodeResult = await tokenHandler.decode(token, {
			cipher: {
				prefix: "encrypted",
			},
		});

		expect(token.startsWith("encrypted:")).toBe(true);
		expect(DEither.hasInformation(verifyResult, "token-verified")).toBe(true);
		expect(DEither.hasInformation(decodeResult, "token-decoded")).toBe(true);
	});

	it("returns payload-encode-error when payload does not match its structure", async() => {
		const tokenHandler = createTokenHandler({
			maxAge: DChrono.createTimeOrThrow(5 * 60 * 1000),
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});

		const result = await tokenHandler.create({
			userId: 42,
		} as never);

		expect(DEither.hasInformation(result, "payload-encode-error")).toBe(true);
		await expect(tokenHandler.createOrThrow({
			userId: 42,
		} as never)).rejects.toBeInstanceOf(TokenHandlerCreateError);
	});

	it("throws TokenHandlerWrongConfig when config does not match its structure", () => {
		expect(() => createTokenHandler({
			maxAge: "15 minutes",
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		} as never)).toThrow(TokenHandlerWrongConfig);
	});

	it("roundtrips json codec values and modeling structures", async() => {
		const UserId = DModeling.createNewType("UserId", DDataStructure.string());
		const Email = DModeling.createNewType("Email", DDataStructure.string());
		const Account = DModeling.createEntity("Account", () => ({
			id: UserId,
			email: Email,
		}));
		const LoginChallenge = DModeling.createTaggedObject("LoginChallenge", {
			value: DDataStructure.string(),
			remainingAttempts: DDataStructure.number(),
		});
		const userId = DEither.unwrapRightOrThrow(UserId.map("user-7"));
		const email = DEither.unwrapRightOrThrow(Email.map("user7@example.com"));
		const account = Account.new({
			id: userId,
			email,
		});
		const challenge = LoginChallenge.new({
			value: "mfa",
			remainingAttempts: 2,
		});
		const tokenHandler = createTokenHandler({
			maxAge: DChrono.createTimeOrThrow(5 * 60 * 1000),
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: UserId,
				quota: DDataStructure.bigint(),
				account: Account,
				challenge: LoginChallenge,
			},
		});

		type DecodeResult = Awaited<ReturnType<typeof tokenHandler.decode>>;
		type DecodedToken = Extract<DecodeResult, DEither.Right>;
		type CheckUserId = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["userId"],
			typeof userId,
			"strict"
		>;
		type CheckChallenge = DCommon.ExpectType<
			DEither.GetValue<DecodedToken>["payload"]["challenge"],
			typeof challenge,
			"strict"
		>;

		const token = await tokenHandler.createOrThrow({
			userId,
			quota: 9_007_199_254_740_993n,
			account,
			challenge,
		});
		const result = await tokenHandler.decode(token);

		expect(DEither.hasInformation(result, "token-decoded")).toBe(true);

		const decodedToken = DEither.unwrapRightOrThrow(result);

		expect(decodedToken.payload.quota).toBe(9_007_199_254_740_993n);
		expect(decodedToken.payload.account.id).toBe("user-7");
		expect(decodedToken.payload.challenge.remainingAttempts).toBe(2);
	});

	it("returns token-format when decode receives a malformed token", async() => {
		const result = await accessTokenHandler.decode("not-a-token");

		expect(DEither.hasInformation(result, "token-format")).toBe(true);
	});

	it("returns json errors when decode receives unreadable token content", async() => {
		const validHeader = Buffer
			.from(JSON.stringify({
				typ: "JWT",
				alg: "TEST-SIGNER",
				kid: "main-key",
			}))
			.toString("base64url");
		const validPayload = Buffer
			.from(JSON.stringify({
				iss: "api",
				sub: "access",
				aud: ["web"],
				iat: ExpectedIssuedAt,
				exp: ExpectedAccessExpiration,
				userId: "user-8",
				role: "admin",
			}))
			.toString("base64url");
		const invalidJson = Buffer
			.from("{")
			.toString("base64url");

		const headerResult = await accessTokenHandler.decode(`${invalidJson}.${validPayload}.signature`);
		const payloadResult = await accessTokenHandler.decode(`${validHeader}.${invalidJson}.signature`);

		expect(DEither.hasInformation(headerResult, "header-json-error")).toBe(true);
		expect(DEither.hasInformation(payloadResult, "payload-json-error")).toBe(true);
	});

	it("returns structure decode errors when decode receives readable but invalid token content", async() => {
		const invalidHeader = Buffer
			.from(JSON.stringify({
				typ: "SESSION",
				alg: "TEST-SIGNER",
				kid: "main-key",
			}))
			.toString("base64url");
		const validHeader = Buffer
			.from(JSON.stringify({
				typ: "JWT",
				alg: "TEST-SIGNER",
				kid: "main-key",
			}))
			.toString("base64url");
		const invalidPayload = Buffer
			.from(JSON.stringify({
				iss: "api",
				sub: "access",
				aud: ["web"],
				iat: ExpectedIssuedAt,
				exp: ExpectedAccessExpiration,
				userId: 8,
				role: "admin",
			}))
			.toString("base64url");

		const headerResult = await accessTokenHandler.decode(`${invalidHeader}.${invalidPayload}.signature`);
		const payloadResult = await accessTokenHandler.decode(`${validHeader}.${invalidPayload}.signature`);

		expect(DEither.hasInformation(headerResult, "header-decode-error")).toBe(true);
		expect(DEither.hasInformation(payloadResult, "payload-decode-error")).toBe(true);
	});

	it("applies decode rules before signature verification", async() => {
		const invalidJson = Buffer
			.from("{")
			.toString("base64url");
		const validPayload = Buffer
			.from(JSON.stringify({
				iss: "api",
				sub: "access",
				aud: ["web"],
				iat: ExpectedIssuedAt,
				exp: ExpectedAccessExpiration,
				userId: "user-9",
				role: "admin",
			}))
			.toString("base64url");
		const signature = Buffer
			.from("signature")
			.toString("base64url");

		const missingSignatureResult = await accessTokenHandler.verify(`${invalidJson}.${validPayload}`);
		const decodeResult = await accessTokenHandler.verify(`${invalidJson}.${validPayload}.${signature}`);

		expect(DEither.hasInformation(missingSignatureResult, "signature-invalid")).toBe(true);
		expect(DEither.hasInformation(decodeResult, "header-json-error")).toBe(true);
	});

	it("applies configured issuer and subject rules during verify", async() => {
		const token = await accessTokenHandler.createOrThrow(
			{
				userId: "user-10",
				role: "admin",
			},
			{
				header: {
					kid: "main-key",
				},
			},
		);
		const otherIssuerTokenHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			issuer: "admin-api",
			audience: ["web", "mobile"],
			subject: "access",
			customPayloadShape: {
				userId: DDataStructure.string(),
				role: DDataStructure.union([
					DDataStructure.literal("admin"),
					DDataStructure.literal("user"),
				]),
			},
			customHeaderShape: {
				kid: DDataStructure.string(),
			},
		});
		const otherSubjectTokenHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			issuer: "api",
			audience: ["web", "mobile"],
			subject: "refresh",
			customPayloadShape: {
				userId: DDataStructure.string(),
				role: DDataStructure.union([
					DDataStructure.literal("admin"),
					DDataStructure.literal("user"),
				]),
			},
			customHeaderShape: {
				kid: DDataStructure.string(),
			},
		});

		const issuerResult = await otherIssuerTokenHandler.verify(token);
		const subjectResult = await otherSubjectTokenHandler.verify(token);

		expect(DEither.hasInformation(issuerResult, "issue-invalid")).toBe(true);
		expect(DEither.hasInformation(subjectResult, "subject-invalid")).toBe(true);
	});

	it("returns header-encode-error when a custom header breaks the handler policy", async() => {
		const tokenHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
			customHeaderShape: {
				kid: DDataStructure.string(),
			},
		});

		const result = await tokenHandler.create(
			{
				userId: "user-11",
			},
			{
				header: {
					kid: 11,
				},
			} as never,
		);

		expect(DEither.hasInformation(result, "header-encode-error")).toBe(true);
	});

	it("rejects a token without audience when the verification policy requires one", async() => {
		const tokenWithoutAudienceHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			issuer: "api",
			subject: "access",
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});
		const tokenWithAudienceHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			now: () => IssuedAt,
			signer: createTestSigner({ secret: "access-secret" }),
			issuer: "api",
			audience: "web",
			subject: "access",
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});
		const token = await tokenWithoutAudienceHandler.createOrThrow({
			userId: "user-12",
		});

		const result = await tokenWithAudienceHandler.verify(token);

		expect(DEither.hasInformation(result, "audience-invalid")).toBe(true);
	});

	it("uses the current date when no clock is configured", async() => {
		const tokenHandler = createTokenHandler({
			maxAge: AccessMaxAge,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});

		const token = await tokenHandler.createOrThrow({
			userId: "user-13",
		});
		const result = await tokenHandler.decode(token);

		expect(DEither.hasInformation(result, "token-decoded")).toBe(true);
		expect(DEither.unwrapRightOrThrow(result).payload.userId).toBe("user-13");
	});

	it("accepts an expired token when verification policy receives enough tolerance", async() => {
		let now = IssuedAt;
		const tokenHandler = createTokenHandler({
			maxAge: OneSecond,
			now: () => now,
			signer: createTestSigner({ secret: "access-secret" }),
			customPayloadShape: {
				userId: DDataStructure.string(),
			},
		});
		const token = await tokenHandler.createOrThrow({
			userId: "user-14",
		});

		now = ExpiredAt;
		const result = await tokenHandler.verify(token, {
			tolerance: DChrono.createTimeOrThrow(24 * 60 * 60 * 1000),
		});

		expect(DEither.hasInformation(result, "token-verified")).toBe(true);
		expect(DEither.unwrapRightOrThrow(result).payload.userId).toBe("user-14");
	});
});
