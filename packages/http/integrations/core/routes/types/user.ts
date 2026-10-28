import type * as DChrono from "@duplojs/lang/chrono";

export interface User {
	readonly id: number;
	readonly name: string;
	readonly age: number;
	readonly friends?: readonly User[];
	readonly createdAt?: DChrono.TheDate;
}
