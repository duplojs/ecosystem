/**
 * @title DChrono.addTime
 *
 * Ajouter une durée à une date ou à une autre durée en conservant la nature de l’entrée.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

const dateResult = DChrono.addTime("date0+", "time1000+");
const timeResult = DChrono.addTime("time1000+", "time500+");

// Une date reste une TheDate et une durée reste une TheTime.
type _CheckDate = DCommon.ExpectType<typeof dateResult, DChrono.TheDate, "strict">;
type _CheckTime = DCommon.ExpectType<typeof timeResult, DChrono.TheTime, "strict">;

// La forme curifiée s’applique aussi dans un pipe.
const piped = DCommon.pipe(
	"time1000+" as const,
	DChrono.addTime("time500+"),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheTime, "strict">;

// Les instances TheDate et TheTime peuvent être combinées avec une TheTime.
const dateInstanceResult = DChrono.addTime(
	DChrono.createDate("2021-01-01"),
	DChrono.createTimeOrThrow(1_000),
);
const timeInstanceResult = DChrono.addTime(
	DChrono.createTimeOrThrow(1_000),
	DChrono.createTimeOrThrow(500),
);

type _CheckInstances = DCommon.ExpectType<
	[typeof dateInstanceResult, typeof timeInstanceResult],
	[DChrono.TheDate, DChrono.TheTime],
	"strict"
>;

