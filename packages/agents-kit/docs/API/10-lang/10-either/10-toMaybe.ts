/**
 * @title DEither.toMaybe
 *
 * Convertir une valeur, une absence ou un Either en représentation Maybe.
 */
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import * as DCommon from "@duplojs/lang/common";

const present = DEither.toMaybe("Alice");
const absent = DEither.toMaybe(undefined);
const existing = DEither.toMaybe(DEither.success("Alice"));

// Une valeur présente devient Some, tandis que null et undefined deviennent None.
type _CheckPresent = DCommon.ExpectType<typeof present, DEither.Some<string>, "strict">;
type _CheckAbsent = DCommon.ExpectType<typeof absent, DEither.None, "strict">;
// Un Either existant est transmis sans être encapsulé une seconde fois.
type _CheckExisting = DCommon.ExpectType<typeof existing, DEither.Success<"Alice">, "strict">;

declare const nullableName: string | null | undefined;

// Une valeur nullable devient un Either exploitable par les outils de discrimination.
const maybeName = DCommon.pipe(
	nullableName,
	DEither.toMaybe,
);
type _CheckMaybeName = DCommon.ExpectType<typeof maybeName, DEither.Some<string> | DEither.None, "strict">;

// Dans un pipe ordinaire, whenIsRight transforme uniquement la présence et
// transmet None sans exécuter la callback.
const normalizedName = DCommon.pipe(
	nullableName,
	DEither.toMaybe,
	DEither.whenIsRight(DString.toUpperCase),
);
type _CheckNormalizedName = DCommon.ExpectType<
	typeof normalizedName,
	DEither.None | Uppercase<string>,
	"strict"
>;

// Dans un rightPipe, None devient un arrêt : l’étape suivante ne reçoit que la
// valeur d’un Some et n’est pas exécutée lorsque la valeur initiale est absente.
const rightPipedName = DEither.rightPipe(
	nullableName,
	DEither.toMaybe,
	DString.toUpperCase,
);
type _CheckRightPipedName = DCommon.ExpectType<
	typeof rightPipedName,
	DEither.None | DEither.Success<Uppercase<string>>,
	"strict"
>;
