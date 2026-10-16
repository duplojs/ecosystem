/**
 * @title Conversion des absences et exceptions en résultats.
 *
 * Distinguer les refus prévisibles des défaillances d'environnement et adapter les absences ou exceptions en résultats.
 */
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";

// Une issue prévisible et exploitable par le traitement appartient à son contrat
// de résultat : donnée invalide, absence ou refus d'une manipulation. Cela vaut
// aussi pour les opérations techniques ; toute vérification de donnée externe
// produit un Either pour laisser l'appelant décider de la suite.
// Lors d'une défaillance imprévue de l'environnement, les dépendances ou le runtime
// peuvent déjà lever une exception. Elle remonte implicitement à travers les appels ;
// le code applicatif n'ajoute pas de throw dans les fonctions réutilisables.
// Un throw explicite ou une conversion par OrThrow appartient à la consommation
// finale du résultat, lorsque la frontière d'exécution décide de sa conséquence.
// La distinction dépend du rôle de l'échec, pas de sa rareté ni du coût de propagation.
// Le seul fait d'accéder à une ressource extérieure ne transforme pas une absence
// prévue par l'opération en défaillance de l'environnement.

// Maybe représente une présence ou une absence : Some<Value> est un Right, None est un Left.
// toMaybe convertit null et undefined en None et les valeurs présentes en Some.
// Un Either déjà construit est transmis tel quel.

declare function someFunction(): string | number | null | undefined;

// DEither.None | DEither.Some<string> | DEither.Some<number>
const resultToMaybe = DEither.toMaybe(someFunction());

interface User {
	name: string;
}
declare function findUser(): DEither.Maybe<User>;

// Une transformation sur Some reçoit le User ; None est transmis sans exécuter la callback.
// DEither.None | DEither.Success<string>
const userName = DCommon.pipe(
	findUser(),
	DEither.whenIsRight((user) => DEither.success(user.name)),
);

// Une API qui lève sur un refus prévisible doit être adaptée pour le rendre
// exploitable comme résultat. Ne pas déduire la nature de l'échec du choix de cette API.
// safeCallback transforme une exception en SafeCallbackError, dont la valeur est unknown.
// Une valeur brute devient SafeCallbackSuccess ; un Either retourné est conservé.
// La capture est large : distinguer le refus documenté d'une cause technique.
// Conserver cette cause dans le résultat jusqu'à sa consommation finale, sans
// la requalifier en refus métier ni la relancer depuis une fonction réutilisable.
// DEither.SafeCallbackError | DEither.SafeCallbackSuccess<"test">
const resultSafeCallback = DEither.safeCallback(
	() => "test" as const,
);
// asyncSafeCallback capture aussi les rejets et retourne toujours une Promise de résultat.
declare function loadValue(): Promise<string>;
const asyncSafeResult = DEither.asyncSafeCallback(loadValue);

// safeCallback gère aussi les promesses, mais une exception synchrone peut produire
// directement un Left : préférer asyncSafeCallback pour un retour toujours asynchrone.
