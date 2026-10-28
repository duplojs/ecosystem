import { usersRoute } from "./variables";

interface Route {
	readonly foreign: true;
}

declare const foreign: { handler(): Route };
declare const primitive: { handler(): number };
declare const other: {
	handler(): Date;
	different(): void;
};
declare const unknown: { handler: unknown };
declare function handler(): void;

const foreignRoute = foreign.handler();
const numberValue = 1;
const dateValue = other.handler();
const { destructured } = { destructured: 1 };
const [first] = [1];
const { definition } = usersRoute;

foreign.handler();
primitive.handler();
other.handler();
other.different();
// @ts-expect-error An unresolved signature must never be mistaken for a route.
unknown.handler();
handler();
void "unchanged";
