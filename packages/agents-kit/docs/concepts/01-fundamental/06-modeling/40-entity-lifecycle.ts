/**
 * @title Cycle de vie des entités.
 *
 * États, préconditions et transitions métier représentés par des Flag et des Fact.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DChrono from "@duplojs/lang/chrono";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";

// Le modèle et les signatures expriment les états possibles, leurs preuves et les événements
// qui font évoluer l’entité. Les préconditions deviennent des exigences de typage.
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

	// Les `TaggedObject` décrivent les propriétés propres à chaque état.
	// Leur tag permet de discriminer ces formes ; leur fonctionnement est détaillé
	// dans le concept consacré aux objets taggés.
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

	// La shape de l'entité reste fixe pendant son cycle de vie.
	// Les propriétés dont la forme varie sont modélisées par des unions : ici,
	// `state` contient soit `AwaitingValidationState`, soit `ValidateState`.
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

	// Un `Flag` certifie une condition sur l'entité actuelle : état, capacité ou relation.
	// Plusieurs flags compatibles peuvent coexister, indépendamment des variantes de `state`.
	// Ici, chacun porte au runtime la payload de l'état qu'il certifie.
	// Une fonction exigeant `User.Entity & User.AwaitingValidationFlag` reçoit ainsi
	// une entité dont l'état d'attente est prouvé, avec son `AwaitingValidationState`.
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

	// Après hydratation, `state` reste typé comme l'union des états possibles.
	// `refineState` inspecte sa valeur et ajoute le flag correspondant sans modifier
	// les propriétés métier. Chaque branche retourne un Result : elle constate l'état,
	// sans décider si celui-ci autorise l'opération envisagée par l'appelant.
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

// Une `Fact` représente une création ou une modification métier de l'entité,
// y compris un changement de propriété qui conserve le même état nommé.
// Sa payload décrit l'événement et reste portée par l'entité après application du fait.
// Ici, la création place toujours l'utilisateur en attente de validation.
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
	typeof User.Entity
>("UserCreated")(
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

const createdUser = DCommon.pipe(
	UserCreateFact.run({
		id,
		age,
		name,
	}),
	DEither.unwrapRight,
);

declare const address: User.Address;

// Le type de `createdUser` prouve qu'il possède
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
		createdUser,
		{ address },
	),
	DEither.unwrapRight,
);
