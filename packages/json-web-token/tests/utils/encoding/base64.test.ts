import { decodeBase64, encodeBase64 } from "@scripts";

describe("encodeBase64 / decodeBase64", () => {
	it("encodes a Uint8Array", () => {
		const value = new Uint8Array([72, 101, 108, 108, 111]);
		const result = encodeBase64(value);

		expect(result).toBe("SGVsbG8=");
	});

	it("encodes an ArrayBuffer", () => {
		const value = new Uint8Array([72, 101, 108, 108, 111]).buffer;

		expect(encodeBase64(value)).toBe("SGVsbG8=");
	});

	it("uses native Uint8Array base64 encoding when available", () => {
		const descriptor = Object.getOwnPropertyDescriptor(Uint8Array.prototype, "toBase64");
		const toBase64 = vi.fn(() => "native");

		Object.defineProperty(Uint8Array.prototype, "toBase64", {
			configurable: true,
			value: toBase64,
		});

		try {
			expect(encodeBase64(new Uint8Array([72]))).toBe("native");
			expect(toBase64).toHaveBeenCalledOnce();
		} finally {
			if (descriptor) {
				Object.defineProperty(Uint8Array.prototype, "toBase64", descriptor);
			} else {
				Reflect.deleteProperty(Uint8Array.prototype, "toBase64");
			}
		}
	});

	it("decodes a base64 string", () => {
		const result = decodeBase64("SGVsbG8=");

		expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
	});

	it("uses native Uint8Array base64 decoding when available", () => {
		const descriptor = Object.getOwnPropertyDescriptor(Uint8Array, "fromBase64");
		const output = new Uint8Array([72]);
		const fromBase64 = vi.fn(() => output);

		Object.defineProperty(Uint8Array, "fromBase64", {
			configurable: true,
			value: fromBase64,
		});

		try {
			expect(decodeBase64("SA==")).toBe(output);
			expect(fromBase64).toHaveBeenCalledWith("SA==");
		} finally {
			if (descriptor) {
				Object.defineProperty(Uint8Array, "fromBase64", descriptor);
			} else {
				Reflect.deleteProperty(Uint8Array, "fromBase64");
			}
		}
	});

	it("round trips a big buffer", () => {
		const value = Uint8Array.from(
			{ length: 0x8000 + 5 },
			(__, index) => index % 256,
		);

		expect(decodeBase64(encodeBase64(value))).toEqual(value);
	});
});
