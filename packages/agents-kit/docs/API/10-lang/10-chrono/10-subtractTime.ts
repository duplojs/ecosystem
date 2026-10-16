/**
 * @title DChrono.subtractTime
 *
 * Soustraire une durée à une date ou à une autre durée en conservant la nature de l’entrée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const dateResult = DChrono.subtractTime("date1000+", "time500+");
const timeResult = DChrono.subtractTime("time1000+", "time500+");

// Une date reste une TheDate et une durée reste une TheTime.
type _CheckDate = DCommon.ExpectType<typeof dateResult, DChrono.TheDate, "strict">;
type _CheckTime = DCommon.ExpectType<typeof timeResult, DChrono.TheTime, "strict">;

// La forme curifiée s’applique aussi dans un pipe.
const piped = DCommon.pipe(
	"date1000+" as const,
	DChrono.subtractTime("time500+"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheDate, "strict">;

// Les instances TheDate et TheTime peuvent être combinées avec une TheTime.
const dateInstanceResult = DChrono.subtractTime(
	DChrono.createDate("2021-01-01"),
	DChrono.createTimeOrThrow(1_000),
);
const timeInstanceResult = DChrono.subtractTime(
	DChrono.createTimeOrThrow(1_000),
	DChrono.createTimeOrThrow(500),
);

type _CheckInstances = DCommon.ExpectType<
	[typeof dateInstanceResult, typeof timeInstanceResult],
	[DChrono.TheDate, DChrono.TheTime],
	"strict"
>;

