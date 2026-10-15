/**
 * @title Contraintes personnalisées.
 *
 * Déclaration, predicate de validation et extension des règles de cast.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";

// Étendre Constraint avec un identifiant propre à la propriété modélisée.
// Cette interface n’ajoute aucun marqueur à la valeur runtime.
interface Adult extends DCommon.Constraint<"example-adult"> {}

// La signature du predicate doit correspondre à une vérification réelle.
function isAdult(input: number): input is number & Adult {
	return DNumber.greaterThanOrEqual(input, 18);
}

declare const candidate: number;
if (isAdult(candidate)) {
	const adult: number & Adult = candidate;
}

// Les règles de cast peuvent être étendues par augmentation du module common.
// Cette règle reconnaît la preuve GreaterThanOrEqual<18> comme suffisante pour Adult.
// Elle ne couvre volontairement pas toutes les autres bornes compatibles.
declare module "@duplojs/lang/common" {
	interface ComputeCastConstraintNumberRule<
		GenericValue extends number,
		GenericExpectedConstraint extends DCommon.BaseConstraint,
	> {
		exampleAdult: GenericExpectedConstraint extends Adult
			? GenericValue extends DNumber.GreaterThanOrEqual<18>
				? unknown
				: DCommon.CastError<"La preuve de majorité est absente.", GenericValue, GenericExpectedConstraint>
			: never;
	}
}

// unknown accepte la compatibilité, CastError la refuse, never ignore les autres cibles.
// Consulter les interfaces de règles existantes pour étendre les autres domaines.
declare const verifiedAge: number & DNumber.GreaterThanOrEqual<18>;
const adultFromProof: number & Adult = DCommon.cast(verifiedAge);

// @ts-expect-error Un nombre sans preuve ne peut pas être converti en Adult.
const adultWithoutProof: number & Adult = DCommon.cast(candidate);
