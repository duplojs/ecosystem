/**
 * @title DModeling — NewType
 *
 * Distinguer une valeur par son identité métier et lui associer des contraintes vérifiées.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";
import type * as DNumber from "@duplojs/lang/number";

// Le nom distingue les rôles métier, même lorsque les valeurs ont la même représentation.
const UserEmail = DModeling.createNewType(
	"UserEmail",
	DDataStructure.string(),
	[DDataStructure.email()],
);
type UserEmail = DDataStructure.StructureValue<typeof UserEmail>;
const ContactEmail = DModeling.createNewType(
	"ContactEmail",
	DDataStructure.string(),
	[DDataStructure.email()],
);
type ContactEmail = DDataStructure.StructureValue<typeof ContactEmail>;

type _CheckUserEmail = DCommon.ExpectType<
	UserEmail,
	string & DModeling.NewType<"UserEmail", DString.Email>,
	"strict"
>;

declare const userEmail: UserEmail;
declare const contactEmail: ContactEmail;
declare function sendToUser(email: UserEmail): void;
declare function sendToEmail(email: string & DString.Email): void;

sendToUser(userEmail);
// @ts-expect-error Le rôle ContactEmail ne prouve pas l'identité UserEmail.
sendToUser(contactEmail);
// @ts-expect-error Une chaîne seule ne prouve ni l'identité ni le format.
sendToUser("alice@example.com");
// La contrainte email du NewType satisfait aussi un contrat technique d'adresse email.
sendToEmail(userEmail);

// L'identité NewType est une contrainte de type ; la valeur reste une chaîne au runtime.
// map vérifie la structure et ses contraintes avant de fournir cette identité.
const mapped = UserEmail.map("alice@example.com");
// Une adresse invalide produit un Left « map-error ».
const rejected = UserEmail.map("not-an-email");
type _CheckMapped = DCommon.ExpectType<
	typeof mapped,
	| DEither.Right<"map-success", UserEmail>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"map-error", DDataStructure.Error>,
	"strict"
>;
type _CheckRejected = DCommon.ExpectType<
	typeof rejected,
	typeof mapped,
	"strict"
>;

// Plusieurs contraintes ajoutent chacune une garantie exploitable sur la même valeur.
const UserName = DModeling.createNewType(
	"UserName",
	DDataStructure.string(),
	[DDataStructure.trimmed(), DDataStructure.minCharacters(3), DDataStructure.maxCharacters(40)],
);
type UserName = DDataStructure.StructureValue<typeof UserName>;
type _CheckUserName = DCommon.ExpectType<
	UserName,
	string & DModeling.NewType<"UserName", DString.Trimmed | DString.MinCharacters<3> | DString.MaxCharacters<40>>,
	"strict"
>;
declare const userName: UserName;
declare function useShortName(name: string & DString.MaxCharacters<40>): void;
useShortName(userName);

// Les contraintes s'appliquent aussi à d'autres structures, ici une plage numérique.
const Percentage = DModeling.createNewType(
	"Percentage",
	DDataStructure.number(),
	[DDataStructure.greaterThanOrEqual(0), DDataStructure.lessThanOrEqual(100)],
);
type Percentage = DDataStructure.StructureValue<typeof Percentage>;
type _CheckPercentage = DCommon.ExpectType<
	Percentage,
	number & DModeling.NewType<"Percentage", DNumber.GreaterThanOrEqual<0> | DNumber.LessThanOrEqual<100>>,
	"strict"
>;
const percentage = Percentage.map(75);
type _CheckPercentageResult = DCommon.ExpectType<
	typeof percentage,
	| DEither.Right<"map-success", Percentage>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"map-error", DDataStructure.Error>,
	"strict"
>;
