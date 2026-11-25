/**
 * @title DInvocation — Résultats supplémentaires
 *
 * Étendre les résultats d'une fonction ou des méthodes d'un contrat.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

type BookId = string & DInvocation.Evidence<"existing-book">;
interface Book {
	id: BookId;
	title: string;
}

// Le domaine attend un livre pour un identifiant dont l'existence a été établie.
interface Repository {
	findById(id: BookId): Promise<Book>;
	name(): string;
}

// L'application prévoit que le livre a pu disparaître entre-temps.
interface RepositoryPort extends DInvocation.AddAdditionalResultOnMethods<
	Repository,
	{ findById: DEither.Left<"book-no-longer-exists", BookId> }
> {}
const RepositoryPort = DInvocation.createPort<RepositoryPort>();

declare function readBook(id: BookId): Promise<Book | undefined>;

// withAdditionalResult fournit l'évidence exigée par le port sans modifier la fonction.
const repository = RepositoryPort.createImplementation({
	findById: DInvocation.withAdditionalResult(async(id) => {
		const book = await readBook(id);
		return book ?? DEither.left("book-no-longer-exists", id);
	}),
	name: () => "books",
});

async function loadBook(id: BookId) {
	const book = await repository.findById(id);
	type _CheckBook = DCommon.ExpectType<
		typeof book,
		Book | DEither.Left<"book-no-longer-exists", BookId>,
		"strict"
	>;
	return book;
}

// AddAdditionalResultOnFunction étend le même contrat lorsqu'une fonction suffit.
type FindById = DInvocation.AddAdditionalResultOnFunction<
	Repository["findById"],
	DEither.Left<"book-no-longer-exists", BookId>
>;
const findById: FindById = DInvocation.withAdditionalResult(async(id) => {
	const book = await readBook(id);
	return book ?? DEither.left("book-no-longer-exists", id);
});

declare const id: BookId;
const found = findById(id);
type _CheckFound = DCommon.ExpectType<
	typeof found,
	Promise<Book> | Promise<DEither.Left<"book-no-longer-exists", BookId>>,
	"strict"
>;
