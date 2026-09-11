import { readFile } from "node:fs/promises";
import { setCurrentWorkingDirectory } from "@duplojs/server";
import * as DCommon from "@duplojs/lang/common";
import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Cipher, Signer, createTokenHandler, decodeBase64Url, decodeText, encodeBase64Url } from "@duplojs/json-web-token";

describe("createTokenHandler", () => {
	setCurrentWorkingDirectory(import.meta.dirname as never);

	async function readKeyPair(directory: string) {
		return {
			privateKey: await readFile(`keys/${directory}/private-key.pkcs8.pem`, "utf-8"),
			publicKey: await readFile(`keys/${directory}/public-key.spki.pem`, "utf-8"),
		};
	}

	const createCustomSigner = Signer.factory(
		"CUSTOM",
		(params: { prefix: string }) => ({
			sign(content) {
				return encodeBase64Url(`${params.prefix}:${content}`);
			},
			verify(content, signature) {
				return signature === encodeBase64Url(`${params.prefix}:${content}`);
			},
		}),
	);

	const createCustomCipher = Cipher.factory(
		"CUSTOM",
		(params: { prefix: string }) => ({
			encrypt(value) {
				return encodeBase64Url(`${params.prefix}:${value}`);
			},
			decrypt(value) {
				const decryptedValue = decodeText(decodeBase64Url(value));

				return decryptedValue.slice(`${params.prefix}:`.length);
			},
		}),
	);

	function createExpectedSeconds(now: DChrono.TheDate, maxAge: DChrono.TheTime) {
		const issuedAt = Math.floor(DChrono.toTimestamp(now) / 1000);

		return {
			issuedAt,
			expiration: issuedAt + DChrono.computeTime(maxAge, "second"),
		};
	}

	it("creates verifies and decodes a hs256 token without cipher", async() => {
		const now = DChrono.now();
		const maxAge = DChrono.createTime(30, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			issuer: "duplo",
			subject: "user",
			audience: ["app"],
			maxAge,
			now: () => now,
			signer: Signer.createHS256({ secret: "secret" }),
			customPayloadShape: {
				id: DDataStructure.string(),
				role: DDataStructure.literal("admin"),
			},
			customHeaderShape: {
				kid: DDataStructure.optional(DDataStructure.string()),
			},
		});

		const tokenResult = await tokenHandler.create(
			{
				id: "1",
				role: "admin",
			},
			{
				header: {
					kid: "main",
				},
			},
		);
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.decode(token)).toEqual(DEither.right("token-decoded", {
			header: {
				typ: "JWT",
				alg: "HS256",
				kid: "main",
			},
			payload: {
				iss: "duplo",
				sub: "user",
				aud: ["app"],
				exp: expiration,
				iat: issuedAt,
				id: "1",
				role: "admin",
			},
		}));
		expect(await tokenHandler.verify(token)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "HS256",
				kid: "main",
			},
			payload: {
				iss: "duplo",
				sub: "user",
				aud: ["app"],
				exp: expiration,
				iat: issuedAt,
				id: "1",
				role: "admin",
			},
		}));
	});

	it("creates verifies and decodes a hs512 token with rsa oaep", async() => {
		const cipherKeys = await readKeyPair("rsa-oaep");
		const now = DChrono.now();
		const maxAge = DChrono.createTime(20, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			maxAge,
			now: () => now,
			signer: Signer.createHS512({ secret: "secret" }),
			cipher: Cipher.createRSAOAEP(cipherKeys),
			customPayloadShape: {
				id: DDataStructure.string(),
			},
		});

		const tokenResult = await tokenHandler.create({
			id: "42",
		});
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.decode(token)).toEqual(DEither.right("token-decoded", {
			header: {
				typ: "JWT",
				alg: "HS512",
			},
			payload: {
				iss: undefined,
				sub: undefined,
				aud: undefined,
				exp: expiration,
				iat: issuedAt,
				id: "42",
			},
		}));
		expect(await tokenHandler.verify(token)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "HS512",
			},
			payload: {
				iss: undefined,
				sub: undefined,
				aud: undefined,
				exp: expiration,
				iat: issuedAt,
				id: "42",
			},
		}));
	});

	it("creates and verifies a hs256 token with rsa oaep 256", async() => {
		const cipherKeys = await readKeyPair("rsa-oaep-256");
		const now = DChrono.now();
		const maxAge = DChrono.createTime(20, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			maxAge,
			now: () => now,
			signer: Signer.createHS256({ secret: "secret" }),
			cipher: Cipher.createRSAOAEP256(cipherKeys),
			customPayloadShape: {
				id: DDataStructure.string(),
			},
		});

		const tokenResult = await tokenHandler.create({
			id: "91",
		});
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.verify(token)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "HS256",
			},
			payload: {
				iss: undefined,
				sub: undefined,
				aud: undefined,
				exp: expiration,
				iat: issuedAt,
				id: "91",
			},
		}));
	});

	it("creates and verifies a token with a custom signer from factory", async() => {
		const now = DChrono.now();
		const maxAge = DChrono.createTime(15, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			maxAge,
			now: () => now,
			signer: createCustomSigner({ prefix: "custom-sign" }),
			customPayloadShape: {
				id: DDataStructure.string(),
			},
			customHeaderShape: {
				kid: DDataStructure.optional(DDataStructure.string()),
			},
		});

		const tokenResult = await tokenHandler.create({
			id: "12",
		});
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.verify(token)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "CUSTOM",
			},
			payload: {
				iss: undefined,
				sub: undefined,
				aud: undefined,
				exp: expiration,
				iat: issuedAt,
				id: "12",
			},
		}));
	});

	it("creates and verifies a token with a custom signer and custom cipher from factories", async() => {
		const now = DChrono.now();
		const maxAge = DChrono.createTime(20, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			issuer: "duplo",
			audience: ["web"],
			maxAge,
			now: () => now,
			signer: createCustomSigner({ prefix: "custom-sync-sign" }),
			cipher: createCustomCipher({ prefix: "custom-sync-cipher" }),
			customPayloadShape: {
				id: DDataStructure.string(),
				mode: DDataStructure.literal("custom"),
			},
		});

		const tokenResult = await tokenHandler.create({
			id: "23",
			mode: "custom",
		});
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.verify(token)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "CUSTOM",
			},
			payload: {
				iss: "duplo",
				sub: undefined,
				aud: ["web"],
				exp: expiration,
				iat: issuedAt,
				id: "23",
				mode: "custom",
			},
		}));
	});

	it("returns expired after the max age", async() => {
		const createdAt = DChrono.now();
		const verifiedAt = DChrono.addMinutes(createdAt, 2);
		const signer = Signer.createHS256({ secret: "secret" });
		const createHandler = createTokenHandler({
			maxAge: DChrono.createTime(1, "minute"),
			now: () => createdAt,
			signer,
			customPayloadShape: {
				id: DDataStructure.string(),
			},
		});
		const verifyHandler = createTokenHandler({
			maxAge: DChrono.createTime(1, "minute"),
			now: () => verifiedAt,
			signer,
			customPayloadShape: {
				id: DDataStructure.string(),
			},
		});
		const tokenResult = await createHandler.create({
			id: "1",
		});
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		const verifyResult = await verifyHandler.verify(token);

		expect(DEither.hasInformation(verifyResult, "expired")).toBe(true);
	});

	it("creates and verifies a token with signer and cipher creators passed directly", async() => {
		const cipherKeys = await readKeyPair("rsa-oaep");
		const now = DChrono.now();
		const maxAge = DChrono.createTime(10, "minute");
		const { issuedAt, expiration } = createExpectedSeconds(now, maxAge);
		const tokenHandler = createTokenHandler({
			maxAge,
			now: () => now,
			signer: Signer.createHS256,
			cipher: Cipher.createRSAOAEP,
			customPayloadShape: {
				id: DDataStructure.string(),
			},
		});

		const tokenResult = await tokenHandler.create(
			{
				id: "09",
			},
			{
				signer: {
					secret: "secret",
				},
				cipher: cipherKeys,
			},
		);
		DCommon.asserts(tokenResult, DEither.isRight);
		const token = DEither.unwrapRight(tokenResult);

		expect(await tokenHandler.verify(
			token,
			{
				signer: {
					secret: "secret",
				},
				cipher: cipherKeys,
			},
		)).toEqual(DEither.right("token-verified", {
			header: {
				typ: "JWT",
				alg: "HS256",
			},
			payload: {
				iss: undefined,
				sub: undefined,
				aud: undefined,
				exp: expiration,
				iat: issuedAt,
				id: "09",
			},
		}));
		const invalidSignatureResult = await tokenHandler.verify(
			token,
			{
				signer: {
					secret: "wrong-secret",
				},
				cipher: cipherKeys,
			},
		);

		expect(DEither.hasInformation(invalidSignatureResult, "signature-invalid")).toBe(true);
	});
});
