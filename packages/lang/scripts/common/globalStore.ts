export interface GlobalStore {

}

const store = {} as GlobalStore;

export interface GlobalStoreHandler<
	GenericValue extends unknown,
> {
	readonly value: GenericValue;
	set(value: GenericValue): void;
}

export function createGlobalStore<
	GenericStoreName extends keyof GlobalStore,
>(
	storeName: GenericStoreName,
	defaultValue: GlobalStore[GenericStoreName],
): GlobalStoreHandler<GlobalStore[GenericStoreName]> {
	if (store[storeName] === undefined) {
		store[storeName] = defaultValue;
	}

	return {
		get value() {
			return store[storeName];
		},

		set(value) {
			store[storeName] = value;
		},
	};
}

