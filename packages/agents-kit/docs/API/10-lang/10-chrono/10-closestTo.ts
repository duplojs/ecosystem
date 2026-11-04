/**
 * @title DChrono.closestTo
 *
 * Trouver dans une collection la date la plus proche d’une date cible.
 */
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";

declare const dates: readonly [DChrono.TheDate, DChrono.TheDate];
const target = DChrono.createDate("2021-01-15");

const closest = DChrono.closestTo(dates, target);

// La sortie est la date la plus proche ; en cas d’égalité, la première date retenue est conservée.
type _CheckClosest = DCommon.ExpectType<typeof closest, DChrono.TheDate | undefined, "strict">;

// Le paramètre favorPast impose de retenir une date antérieure lorsque c’est possible.
const pastClosest = DChrono.closestTo(dates, target, { tieBreaker: "favorPast" });
type _CheckPastClosest = DCommon.ExpectType<typeof pastClosest, DChrono.TheDate | undefined, "strict">;

// La valeur favorFuture retient l’antérieure ou l’ultérieure selon la stratégie demandée.
const futureClosest = DChrono.closestTo(dates, target, { tieBreaker: "favorFuture" });
type _CheckFutureClosest = DCommon.ExpectType<typeof futureClosest, DChrono.TheDate | undefined, "strict">;

// La forme curifiée s’utilise comme étape de pipe sur la collection.
const piped = DCommon.pipe(
	dates,
	DChrono.closestTo(target),
);
type _CheckPiped = DCommon.ExpectType<typeof piped, DChrono.TheDate | undefined, "strict">;

// Les collections peuvent mélanger TheDate et dates sérialisées.
declare const mixedDates: readonly [
	DChrono.TheDate | DChrono.SerializedTheDate,
	DChrono.TheDate | DChrono.SerializedTheDate,
];
const mixedClosest = DChrono.closestTo(
	mixedDates,
	"date1609804800000+",
	{ tieBreaker: "favorFuture" },
);

// La sortie reste une TheDate éventuellement absente, avec le tie-breaker favorFuture.
type _CheckMixed = DCommon.ExpectType<typeof mixedClosest, DChrono.TheDate | undefined, "strict">;

