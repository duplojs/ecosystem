/**
 * @title Utilisation
 *
 * Toutes les monades sont étendues des monade Right et Left.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

// DEither.Right<"my-result", "superData">
const result = DEither.right("my-result", "superData");

interface User {}
// DEither.None | DEither.Some<"value">
declare function findUser(): DEither.Maybe<User>;

// Plein de façons différentes de décrire les résultats.
declare function someAction(): (
	| DEither.Success<"result">
	| DEither.Left<"fail-task", Error>
	| DEither.Fail
	| DEither.Error<Error>
);

// DEither.None | DEither.Success<"value">
const whenIsRightResult = DCommon.pipe(
	findUser(),
	DEither.whenIsRight(
		(user) => {
			// User
			void user;

			return DEither.success("value");
		},
	),
);
