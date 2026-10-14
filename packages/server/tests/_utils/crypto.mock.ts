import { nodeCrypto } from "@scripts/implementor";

const cryptoMock = {
	randomUUID: vi.fn(),
};

export function getCryptoMock() {
	return cryptoMock;
}

export function setCryptoMock(overrides: Partial<typeof cryptoMock>) {
	vi.spyOn(nodeCrypto, "value", "get").mockReturnValue(cryptoMock as unknown as typeof nodeCrypto.value);
	for (const key of Object.keys(overrides) as (keyof typeof cryptoMock)[]) {
		const value = overrides[key];
		if (value) {
			cryptoMock[key] = value;
		}
	}
	return cryptoMock;
}
