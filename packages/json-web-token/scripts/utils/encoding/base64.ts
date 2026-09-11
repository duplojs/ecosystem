const chunkSize = 0x8000;

export function encodeBase64(input: Uint8Array | ArrayBuffer) {
	const uint8Array = input instanceof Uint8Array
		? input
		: new Uint8Array(input);

	if ("toBase64" in uint8Array && typeof uint8Array.toBase64 === "function") {
		return uint8Array.toBase64();
	}

	const arr = [];
	for (let index = 0; index < uint8Array.length; index += chunkSize) {
		// @ts-expect-error - more efficient than doing it one by one
		arr.push(String.fromCharCode.apply(null, uint8Array.subarray(index, index + chunkSize)));
	}
	return btoa(arr.join(""));
}

export function decodeBase64(encoded: string) {
	if ("fromBase64" in Uint8Array && typeof Uint8Array.fromBase64 === "function") {
		return Uint8Array.fromBase64(encoded);
	}

	const binary = atob(encoded);
	const output = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index++) {
		output[index] = binary.charCodeAt(index);
	}

	return output;
}
