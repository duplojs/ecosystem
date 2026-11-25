/**
 * @title DModeling — Flag
 *
 * Qualifier une entité et composer les preuves de ses conditions actuelles.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DNumber from "@duplojs/lang/number";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";

export namespace User {
	const namespace = DModeling.createEntityNamespace("User");
	export const Age = namespace.createNewType("Age", DDataStructure.number());
	export const BookId = DModeling.createNewType("BookId", DDataStructure.string());
	export type BookId = DDataStructure.StructureValue<typeof BookId>;
	export const Entity = namespace.createEntity(() => ({
		age: Age,
		borrowedBooks: DDataStructure.array(BookId, [DDataStructure.maxElements(5)]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
	export type Age = DDataStructure.StructureValue<typeof Age>;

	// Un flag atteste une condition sur une entité et peut porter la valeur qui la prouve.
	export const Adult = DModeling.createFlag<"Adult", number & DNumber.GreaterThanOrEqual<18>, typeof Entity>("Adult");
	export type Adult = DModeling.GetFlag<typeof Adult>;
	export const CanBorrow = DModeling.createFlag<"CanBorrow", readonly BookId[] & DArray.MaxElements<4>, typeof Entity>("CanBorrow");
	export type CanBorrow = DModeling.GetFlag<typeof CanBorrow>;
}

// append ajoute la preuve mais ne vérifie pas la condition : la qualification
// doit l'établir avant l'appel. Les autres propriétés de l'entité sont conservées.
function qualifyAdult<GenericUser extends User.Entity>(user: GenericUser) {
	if (DNumber.greaterThanOrEqual(user.age, 18)) {
		return DEither.result("adult", User.Adult.append(user, user.age));
	}
	return DEither.result("underage", user);
}

// Un utilisateur peut emprunter si sa liste de cinq emprunts maximum a encore
// une place. La qualification constate une capacité de l'entité à cet instant.
function qualifyBorrowing<GenericUser extends User.Entity>(user: GenericUser) {
	if (DArray.maxElements(user.borrowedBooks, 4)) {
		return DEither.result(
			"can-borrow",
			DCommon.pipe(
				user,
				User.CanBorrow.append(user.borrowedBooks),
			),
		);
	}
	return DEither.result("borrowing-limit-reached", user);
}

declare const user: User.Entity;
const ageResult = qualifyAdult(user);
type _CheckAgeResult = DCommon.ExpectType<
	typeof ageResult,
	| DEither.Result<"adult", User.Entity & DModeling.Flag<"Adult", User.Age & DNumber.GreaterThanOrEqual<18>>>
	| DEither.Result<"underage", User.Entity>,
	"strict"
>;

// Une opération peut exiger les deux conditions : les flags se composent sur la
// même entité, sans déclarer une nouvelle entité pour chaque combinaison d'états.
declare function borrowRestrictedBook(user: User.Entity & User.Adult & User.CanBorrow): void;
// @ts-expect-error L'entité seule ne prouve aucune des deux conditions.
borrowRestrictedBook(user);
declare const adult: User.Entity & User.Adult;
// @ts-expect-error La majorité seule ne prouve pas qu'une place d'emprunt est disponible.
borrowRestrictedBook(adult);

function qualifyForBorrowing(input: User.Entity) {
	const adultResult = DCommon.pipe(
		qualifyAdult(input),
		DEither.keepAsRightByInformation("adult"),
		DEither.unwrapRight,
	);
	if (DEither.isLeft(adultResult)) {
		return adultResult;
	}

	const capacityResult = DCommon.pipe(
		qualifyBorrowing(adultResult),
		DEither.keepAsRightByInformation("can-borrow"),
		DEither.unwrapRight,
	);
	if (DEither.isLeft(capacityResult)) {
		return capacityResult;
	}

	borrowRestrictedBook(capacityResult);
	return DEither.right("borrowing-ready", capacityResult);
}

const borrowingResult = qualifyForBorrowing(user);
type _CheckBorrowingResult = DCommon.ExpectType<
	typeof borrowingResult,
	| DEither.Left<"underage", User.Entity>
	| DEither.Left<"borrowing-limit-reached", User.Entity & DModeling.Flag<"Adult", User.Age & DNumber.GreaterThanOrEqual<18>>>
	| DEither.Right<"borrowing-ready", User.Entity & DModeling.Flag<"Adult", User.Age & DNumber.GreaterThanOrEqual<18>> & DModeling.Flag<"CanBorrow", readonly User.BookId[] & DArray.MaxElements<5> & DArray.MaxElements<4>>>,
	"strict"
>;

// has reconnaît un flag déjà posé ; getPayload lit la valeur qu'il porte.
declare const candidate: (User.Entity & User.Adult) | (User.Entity & User.CanBorrow);
if (User.Adult.has(candidate)) {
	type _CheckCandidate = DCommon.ExpectType<
		typeof candidate,
		User.Entity & User.Adult,
		"strict"
	>;
	const age = User.Adult.getPayload(candidate);
	type _CheckAge = DCommon.ExpectType<
		typeof age,
		number & DNumber.GreaterThanOrEqual<18>,
		"strict"
	>;
}

// La preuve concerne l'entité vérifiée. Une mise à jour reconstruit l'entité et
// retire les flags ; les conditions utiles doivent être établies à nouveau.
declare const qualified: User.Entity & User.Adult & User.CanBorrow;
const updated = User.Entity.update(qualified, { age: qualified.age });
type _CheckUpdated = DCommon.ExpectType<
	typeof updated,
	User.Entity,
	"strict"
>;
// @ts-expect-error La nouvelle valeur ne porte plus les preuves précédentes.
borrowRestrictedBook(updated);
