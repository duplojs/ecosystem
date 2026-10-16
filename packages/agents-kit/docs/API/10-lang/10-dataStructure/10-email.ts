/**
 * @title DDataStructure.email
 *
 * Construire une contrainte d’adresse email et l’appliquer à une structure de chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const emailConstraint = DDataStructure.email();
type _CheckConstraint = DCommon.ExpectType<
	typeof emailConstraint,
	DDataStructure.EmailConstraint,
	"strict"
>;

const structure = DDataStructure.string([emailConstraint]);
const result = structure.check("jane@example.com");

// Après validation, la valeur représente une chaîne portant la garantie Email.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Email,
	"strict"
>;
