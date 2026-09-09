import * as DKind from "@scripts/kind";

export const createKind = DKind.createNamespace(
	"DuplojsLangEither",
);

export const informationKind = createKind<
	"information",
	string
>("information");

export const valueKind = createKind<
	"value"
>("value");
