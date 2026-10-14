import { nodeOs } from "@scripts/implementor";

const osMock = {
	tmpdir: vi.fn(),
};

export function getOsMock() {
	return osMock;
}

export function setOsMock(overrides: Partial<typeof osMock>) {
	vi.spyOn(nodeOs, "value", "get").mockReturnValue(osMock as unknown as typeof nodeOs.value);
	for (const key of Object.keys(overrides) as (keyof typeof osMock)[]) {
		const value = overrides[key];
		if (value) {
			osMock[key] = value;
		}
	}
	return osMock;
}
