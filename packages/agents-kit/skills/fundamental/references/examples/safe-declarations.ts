/**
 * @title Déclarer une valeur connue ou traiter une entrée runtime.
 *
 * Distinguer les déclarations sûres et les fabriques renvoyant un Either.
 */
import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const configPath = DPath.declarePath("resources/config.json");
const releaseDate = DChrono.createDate("2026-09-30");
const timeout = DChrono.createTime(2, "hour");

declare const dateInput: string;
declare const timeInput: number;

// Les surcharges runtime renvoient des Either à traiter ou propager.
const dateResult = DChrono.createDate({ value: dateInput });
const timeResult = DChrono.createTime(timeInput);

type _CheckCreation = DCommon.ExpectType<
	[typeof releaseDate, typeof timeout, typeof dateResult, typeof timeResult],
	[DChrono.TheDate, DChrono.TheTime, DChrono.MayBeDate, DChrono.MayBeTime],
	"strict"
>;
