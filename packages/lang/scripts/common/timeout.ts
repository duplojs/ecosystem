export function timeout(milliSeconds?: number) {
	return new Promise<void>((resolve) => void setTimeout(resolve, milliSeconds));
}
