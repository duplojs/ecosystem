const exitExternalAsync = Symbol("exitExternalAsync");

export function createExternalAsyncGenerator<
	GenericItem extends unknown,
>() {
	let externalResolve = undefined as undefined | ((item: GenericItem | typeof exitExternalAsync) => void);

	return {
		asyncGenerator: (async function *() {
			const result = await new Promise<
				GenericItem | typeof exitExternalAsync
			>(
				(resolve) => {
					externalResolve = resolve;
				},
			);

			if (result === exitExternalAsync) {
				return;
			} else {
				yield result;
			}
		})(),
		next: (item: GenericItem) => void externalResolve?.(item),
		exit: () => void externalResolve?.(exitExternalAsync),
	};
}
