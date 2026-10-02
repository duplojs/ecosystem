/**
 * @title Cycle de vie
 *
 * Le cycle de vie d'une entité décrit :
 * - les différents états qu'elle peut posséder ;
 * - les `Flag` permettant de prouver ces états dans le typage ;
 * - les `Fact` représentant les événements qui font évoluer l'entité ;
 * - les conséquences qui doivent être résolues à la suite de certains faits.
 *
 * L'objectif est de représenter les règles du cycle de vie directement
 * dans le modèle et dans les signatures des fonctions.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DChrono from "@duplojs/lang/chrono";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";

export namespace User {
	const namespace = DModeling.createEntityNamespace("User");

	export const Id = namespace.createNewType(
		"Id",
		DDataStructure.string(),
		[DDataStructure.uuid()],
	);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Age = namespace.createNewType(
		"Age",
		DDataStructure.number(),
		[
			DDataStructure.integer(),
			DDataStructure.positive(),
		],
	);
	export type Age = DDataStructure.StructureValue<typeof Age>;

	export const Name = namespace.createNewType(
		"Name",
		DDataStructure.string(),
		[
			DDataStructure.trimmed(),
			DDataStructure.minCharacters(3),
			DDataStructure.maxCharacters(45),
		],
	);
	export type Name = DDataStructure.StructureValue<typeof Name>;

	// Les états du cycle de vie sont représentés par des `TaggedObject`.
	//
	// Leur fonctionnement est détaillé séparément. Ici, leur tag permet surtout
	// d'identifier et de discriminer précisément chaque état possible.
	export const AwaitingValidationState = DModeling.createTaggedObject(
		"AwaitingValidationState",
		{
			sendValidationAt: DDataStructure.date(),
		},
	);
	export type AwaitingValidationState = DDataStructure.StructureValue<typeof AwaitingValidationState>;

	export const Address = namespace.createNewType("Address", DDataStructure.string());
	export type Address = DDataStructure.StructureValue<typeof Address>;

	export const ValidateState = DModeling.createTaggedObject(
		"ValidateState",
		{
			address: Address,
			validateAt: DDataStructure.date(),
		},
	);
	export type ValidateState = DDataStructure.StructureValue<typeof ValidateState>;

	// La shape de l'entité reste fixe pendant tout son cycle de vie.
	//
	// Les propriétés dont la valeur peut évoluer entre plusieurs formes
	// sont modélisées avec une union.
	//
	// `state` indique donc ici que le `User` possède exactement deux états
	// possibles dans son cycle de vie :
	// `AwaitingValidationState` ou `ValidateState`.
	export const Entity = namespace.createEntity(
		() => ({
			id: Id,
			age: Age,
			name: Name,
			state: DDataStructure.union([
				AwaitingValidationState,
				ValidateState,
			]),
		}),
	);
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	// Un `Flag` représente dans le typage une information avérée sur l'entité.
	//
	// Sa payload est ici liée au `State` correspondant.
	// Ajouter ce flag nécessite donc de posséder un `AwaitingValidationState`.
	//
	// Une fonction peut ensuite demander :
	// `User.Entity & User.AwaitingValidationFlag`
	// pour garantir au niveau du typage que l'utilisateur est dans cet état.
	export type AwaitingValidationFlag = DModeling.Flag<
		"AwaitingValidation",
		AwaitingValidationState
	>;
	export const AwaitingValidationFlag = DModeling.createFlag<
		AwaitingValidationFlag,
		typeof Entity
	>("AwaitingValidation");

	export type ValidateFlag = DModeling.Flag<
		"Validate",
		ValidateState
	>;
	export const ValidateFlag = DModeling.createFlag<
		ValidateFlag,
		typeof Entity
	>("Validate");

	// Une entité hydratée possède bien son `state`, mais celui-ci reste typé
	// comme l'union de tous les états possibles.
	//
	// `refineState` transforme cette information runtime en information de typage.
	// Chaque branche du pattern matching associe le `Flag` correspondant au state.
	//
	// Le résultat permet ensuite de travailler avec une entité dont l'état
	// courant est explicitement prouvé par le type.
	export function refineState<
		GenericEntity extends Entity,
	>(entity: GenericEntity) {
		return DPattern.matchWithTaggedObject(
			entity.state,
			{
				AwaitingValidationState: (state) => DEither.result(
					"AwaitingValidation",
					AwaitingValidationFlag.append(entity, state),
				),
				ValidateState: (state) => DEither.result(
					"Validate",
					ValidateFlag.append(entity, state),
				),
			},
		);
	}
}

// Une `Fact` représente un événement avéré dans le cycle de vie d'une entité.
//
// Sa payload contient les informations propres à cet événement et est associée
// à l'entité lorsque la fact est appliquée.
//
// Ici, créer un utilisateur implique également son état initial :
// un nouvel utilisateur est toujours en attente de validation.
export type UserCreateFact = DModeling.Fact<
	"UserCreated",
	{
		id: User.Id;
		age: User.Age;
		name: User.Name;
		state: User.AwaitingValidationState;
	}
>;
export const UserCreateFact = DModeling.createFact<
	UserCreateFact,
	typeof User.Entity,
	["sendValidation"]
>("UserCreated", true)(
	({ applyFact }) => (
		params: {
			id: User.Id;
			age: User.Age;
			name: User.Name;
		},
	) => {
		// La payload décrit complètement le fait qui vient de se produire.
		//
		// Elle contient notamment l'état produit par cette étape du cycle de vie,
		// ce qui permet de conserver cette information avec la `Fact`.
		const payload: DModeling.GetFactPayload<UserCreateFact> = {
			id: params.id,
			age: params.age,
			name: params.name,
			state: User.AwaitingValidationState.new({
				sendValidationAt: DChrono.now(),
			}),
		};

		// La création exprime plusieurs propriétés métier en une seule opération :
		//
		// - l'entité est créée avec `AwaitingValidationState` ;
		// - le `AwaitingValidationFlag` prouve immédiatement cet état ;
		// - `UserCreated` est apposée comme fait courant sur l'entité.
		//
		// La fact possède également une conséquence `sendValidation`.
		// Son résultat sera donc un `FactResolver` tant que cette conséquence
		// n'aura pas été résolue.
		return DCommon.pipe(
			payload,
			User.Entity.new,
			User.AwaitingValidationFlag.append(payload.state),
			applyFact(payload),
		);
	},
);

// Cette `Fact` représente la transition entre l'attente de validation
// et l'état validé.
//
// Sa signature fait elle-même partie de la règle métier :
// seules les entités possédant `AwaitingValidationFlag` peuvent effectuer
// cette transition.
export type ValidateUserFact = DModeling.Fact<
	"ValidateUserFact",
	{
		state: User.ValidateState;
	}
>;
export const ValidateUserFact = DModeling.createFact<
	ValidateUserFact,
	typeof User.Entity
>("ValidateUserFact")(
	({ applyFact }) => (
		user: User.Entity & User.AwaitingValidationFlag,
		params: {
			address: User.Address;
		},
	) => {
		// Le nouvel état appartient à la payload du fait.
		//
		// Le fait `ValidateUserFact` conserve donc également les informations
		// produites lors de cette transition.
		const payload: DModeling.GetFactPayload<ValidateUserFact> = {
			state: User.ValidateState.new({
				address: params.address,
				validateAt: DChrono.now(),
			}),
		};

		// `Entity.update` reconstruit l'entité à partir de sa shape déclarée.
		//
		// Les anciens `Flag` et la précédente `Fact` ne sont donc pas conservés.
		// La transition repart de l'entité dans son nouvel état, puis :
		//
		// - ajoute `ValidateFlag` pour prouver ce nouvel état ;
		// - applique `ValidateUserFact` comme nouveau fait courant.
		return DCommon.pipe(
			user,
			User.Entity.update({ state: payload.state }),
			User.ValidateFlag.append(payload.state),
			applyFact(payload),
		);
	},
);

declare const id: User.Id;
declare const age: User.Age;
declare const name: User.Name;

// Lorsque des conséquences sont associées à une `Fact`, `run` ne fournit pas
// directement l'entité finale.
//
// Il retourne un `FactResolver` contenant déjà l'entité transformée et la fact,
// mais imposant encore la résolution des conséquences déclarées.
const createdUserResolver = DCommon.pipe(
	UserCreateFact.run({
		id,
		age,
		name,
	}),
	DEither.unwrapRight,
);

// `resolve` exécute toutes les conséquences exigées par la fact.
//
// L'entité n'est considérée comme complètement résolue qu'après leur exécution.
// Ici, la création d'un utilisateur implique donc nécessairement
// l'exécution de `sendValidation`.
//
// & DModeling.Entity<"User">
// & {
//     readonly id: User.Id;
//     readonly age: User.Age;
//     readonly name: User.Name;
//     readonly state: User.AwaitingValidationState;
// }
// & DModeling.Flag<"AwaitingValidation", User.AwaitingValidationState>
// & DModeling.Fact<"UserCreated", {
//     id: User.Id;
//     age: User.Age;
//     name: User.Name;
//     state: User.AwaitingValidationState;
// }>
const resolvedUser = await DCommon.asyncPipe(
	createdUserResolver.resolve({
		sendValidation: () => Promise.resolve(DEither.ok()),
	}),
	DEither.unwrapRight,
);

// `runAndResolve` permet d'exécuter une action avant les conséquences.
//
// L'ordre devient donc :
// action fournie -> conséquences de la fact -> entité résolue.
//
// Cela permet notamment d'effectuer une opération principale avant de déclencher
// les effets associés au fait qui vient de se produire.
const runAndResolvedUser = await DCommon.asyncPipe(
	createdUserResolver.runAndResolve(
		() => Promise.resolve(DEither.success("some action")),
		{
			sendValidation: () => Promise.resolve(DEither.ok()),
		},
	),
	DEither.unwrapRight,
);

declare const address: User.Address;

// Le type de `resolvedUser` prouve qu'il possède
// `AwaitingValidationFlag`.
//
// Cette preuve satisfait directement la précondition de `ValidateUserFact`.
// Aucun contrôle supplémentaire de l'état n'est nécessaire ici.

// Après la transition :
// - `state` est précisément `ValidateState` ;
// - `AwaitingValidationFlag` a disparu ;
// - `ValidateFlag` prouve le nouvel état ;
// - `UserCreated` a été remplacée par `ValidateUserFact`.
//
// & DModeling.Entity<"User">
// & {
//     readonly name: string & DModeling.NewType<"UserName", Trimmed | MinCharacters<3> | MaxCharacters<45>>;
//     readonly id: string & DModeling.NewType<"UserId", Uuid>;
//     readonly age: number & DModeling.NewType<"UserAge", Integer | Positive>;
//     readonly state: User.ValidateState;
// }
// & DModeling.Flag<"Validate", User.ValidateState>
// & DModeling.Fact<"ValidateUserFact", {
//     state: User.ValidateState;
// }>
const validateUser = DCommon.pipe(
	ValidateUserFact.run(
		resolvedUser,
		{ address },
	),
	DEither.unwrapRight,
);
