import * as DKind from "@scripts/kind";

export const createKind = DKind.createNamespace(
	"DuplojsLangPattern",
);

export const patternResultKind = createKind(
	"result",
);

export const patternValueMaybeAllKind = createKind(
	"value-maybe-all",
);
