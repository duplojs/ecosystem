import type * as DChrono from "@duplojs/lang/chrono";

import type * as DArray from "@duplojs/lang/array";

import type * as DCommon from "@duplojs/lang/common";
import { type File } from "node:buffer";

export type UserId = number;

export type UserName = string;

export interface User {
	readonly id: UserId;
	readonly name: UserName;
	readonly age: number;
	readonly friends?: undefined | readonly User[];
	readonly createdAt?: undefined | DChrono.TheDate;
}

export type Routes = | {
	readonly path: "/users";
	readonly method: "GET";
	readonly responses: {
		readonly code: "200";
		readonly information: "users.findMany";
		readonly body: readonly User[];
	};
}
| {
	readonly path: "/users/{userId}";
	readonly method: "GET";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "200";
			readonly information: "users.find";
			readonly body: User;
		};
	readonly params: { readonly userId: number };
}
| {
	readonly path: "/stream";
	readonly method: "GET";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "200";
			readonly information: "monSuperStream";
			readonly flux: Uint8Array<ArrayBuffer>;
		};
	readonly query: { readonly value: number };
}
| {
	readonly path: "/stream-text";
	readonly method: "POST";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "200";
			readonly information: "monSuperStream";
			readonly flux: string;
		};
	readonly body: { readonly value: string };
}
| {
	readonly path: "/users";
	readonly method: "POST";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "200";
			readonly information: "users.create";
			readonly body: User;
		};
	readonly body: User;
}
| {
	readonly path: "/users";
	readonly method: "DELETE";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "204";
			readonly information: "users.deleted";
			readonly body: undefined;
		};
	readonly body: { readonly id: number };
}
| {
	readonly path: "/documents";
	readonly method: "POST";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "204";
			readonly information: "file.receive";
			readonly body: undefined;
		};
	readonly body: DCommon.TheFormData<{
		readonly bool: boolean;
		readonly myFile: readonly File[] & DArray.LengthEqual<1>;
		readonly name: string;
	}>;
}
| {
	readonly path: `/documents/${string}`;
	readonly method: "GET";
	readonly responses: {
		readonly code: "200";
		readonly information: "file.send";
		readonly body: File;
	};
}
| {
	readonly path: "/sse";
	readonly method: "GET";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "204";
			readonly information: "close";
			readonly body: undefined;
		}
		| {
			readonly code: "200";
			readonly information: "super-sse";
			readonly events: { message: { test: string } } & { other: string };
		};
	readonly query: { readonly close: boolean | undefined };
}
| {
	readonly path: "/cookie-check";
	readonly method: "GET";
	readonly responses:
		| {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body: Error | undefined;
		}
		| {
			readonly code: "200";
			readonly information: "cookie.checked";
			readonly body: { readonly session: string };
		};
}
| {
	readonly path: "/cookie-drop";
	readonly method: "GET";
	readonly responses: {
		readonly code: "204";
		readonly information: "cookie.dropped";
		readonly body: undefined;
	};
};

export type ProductionRejectionRoutes =
	| {
		readonly method: "POST";
		readonly path: "/rejections/extract";
		readonly body: { readonly id: number };
		readonly responses:
			| {
				readonly code: "422";
				readonly information: "extract-error";
				readonly body: Error;
			}
			| {
				readonly code: "204";
				readonly information: "handled";
				readonly body: undefined;
			};
	}
	| {
		readonly method: "GET";
		readonly path: "/rejections/checker";
		readonly responses:
			| {
				readonly code: "403";
				readonly information: "checker-rejected";
				readonly body: { readonly reason: string };
			}
			| {
				readonly code: "204";
				readonly information: "handled";
				readonly body: undefined;
			};
	}
	| {
		readonly method: "GET";
		readonly path: "/rejections/process";
		readonly responses:
			| {
				readonly code: "409";
				readonly information: "process-rejected";
				readonly body: { readonly reason: "nested" };
			}
			| {
				readonly code: "204";
				readonly information: "handled";
				readonly body: undefined;
			};
	};

export interface CustomExtractionRejectionRoute {
	readonly method: "POST";
	readonly path: "/rejections/extract";
	readonly body: { readonly id: number };
	readonly responses:
		| {
			readonly code: "400";
			readonly information: "custom-extract-error";
			readonly body: { readonly source: "hub" };
		}
		| {
			readonly code: "204";
			readonly information: "handled";
			readonly body: undefined;
		};
}
