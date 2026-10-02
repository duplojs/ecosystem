/**
 * @title Déclaration et hydratation d'un `TaggedObject`.
 *
 * Un `TaggedObject` représente un objet possédant une identité explicite.
 *
 * Il normalise le pattern classique consistant à ajouter manuellement
 * une propriété `type`, `kind`, `status`, etc. afin de créer une union
 * discriminée.
 *
 * L'identité du `TaggedObject` est gérée directement par DuploJS et fait
 * partie de la donnée.
 *
 * Une fois le `TaggedObject` créé, cette identité est conservée lors de sa
 * sérialisation et de son transport. Un autre consommateur peut donc directement
 * le discriminer sans avoir à l'hydrater à nouveau.
 *
 * L'hydratation intervient principalement lorsqu'une donnée externe entre
 * dans le domaine sans encore posséder cette identité.
 *
 * Contrairement à une `Entity`, les propriétés d'un `TaggedObject` ne sont
 * pas obligées d'être représentées par des `NewType`.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";

// Sans `TaggedObject`, une union discriminée serait généralement construite
// en ajoutant soi-même une propriété comme `type` ou `kind`.
//
// `createTaggedObject` normalise cette identité.
// Le code métier n'a pas à choisir ni à manipuler la clé utilisée pour
// enregistrer le tag.
//
// DModeling.ObjectTag<"EmailNotification"> & {
//     readonly email: string;
//     readonly subject: string;
// }
const EmailNotification = DModeling.createTaggedObject(
	"EmailNotification",
	{
		email: DDataStructure.string(),
		subject: DDataStructure.string(),
	},
);
type EmailNotification = DDataStructure.StructureValue<typeof EmailNotification>;

// Les propriétés peuvent être définies directement avec des `DataStructure`.
//
// Contrairement à une `Entity`, un `TaggedObject` n'impose pas que ses
// propriétés soient des `NewType`.
//
// DModeling.ObjectTag<"SmsNotification"> & {
//     readonly phone: string;
//     readonly message: string;
//     readonly attempts: number;
// }
const SmsNotification = DModeling.createTaggedObject(
	"SmsNotification",
	{
		phone: DDataStructure.string(),
		message: DDataStructure.string(),
		attempts: DDataStructure.number(),
	},
);
type SmsNotification = DDataStructure.StructureValue<typeof SmsNotification>;

// Plusieurs `TaggedObject` peuvent former une union discriminée.
//
// Leur identité permet de retrouver précisément la forme correspondante
// sans ajouter manuellement une propriété discriminante au modèle.
type Notification =
	| EmailNotification
	| SmsNotification;

declare const notification: Notification;

// `matchWithTaggedObject` discrimine directement l'union à partir du tag.
//
// Chaque callback reçoit la forme exacte associée à son identité.
const destination = DPattern.matchWithTaggedObject(
	notification,
	{
		EmailNotification: (emailNotification) => emailNotification.email,
		SmsNotification: (smsNotification) => smsNotification.phone,
	},
);

// L'identité peut également être récupérée directement.
//
// "EmailNotification" | "SmsNotification"
const notificationType = DModeling.getTagValue(notification);

// `hasTagValue` permet de tester une identité et affine simultanément
// le type de la valeur.
//
// Dans cette branche, `notification` est précisément un `EmailNotification`.
if (DModeling.hasTagValue(notification, "EmailNotification")) {
	const subject = notification.subject;
}

// `new` est utilisé lorsque les propriétés possèdent déjà le typage attendu.
//
// Il construit le `TaggedObject` et lui associe son identité.
//
// EmailNotification
const emailNotification = EmailNotification.new({
	email: "user@example.com",
	subject: "Account created",
});

// L'identité fait partie de la structure du `TaggedObject`.
//
// Les opérations génériques comme `check`, `is`, `encode` ou `decode`
// travaillent donc avec une valeur qui possède déjà cette identité.
//
// Une donnée brute provenant d'une base de données, d'une API externe
// ou d'un autre système ne la possède généralement pas encore.
declare const externalEmailNotification: {
	email: string;
	subject: string;
};

// `map` sert à hydrater cette donnée lorsqu'elle entre dans le domaine.
//
// Le mapping ajoute l'identité du `TaggedObject`, vérifie sa structure
// et ses contraintes, puis retourne la valeur correctement typée.
//
// Le type demandé en entrée est volontairement moins précis que le type
// métier final afin de représenter les données provenant de systèmes externes.
//
// L'hydratation peut échouer, son résultat est donc représenté par un `Either`.

// DEither.Left<"async-error", DDataStructure.ErrorPromise>
// | DEither.Left<"map-error", DDataStructure.Error>
// | DEither.Right<"map-success", EmailNotification>
const maybeEmailNotification = EmailNotification.map(
	externalEmailNotification,
);

// Une fois hydraté, le tag fait partie de la donnée.
//
// Si ce `TaggedObject` est ensuite sérialisé et transporté vers un autre
// consommateur, son identité est conservée.
// Il n'a donc pas besoin d'être hydraté une seconde fois simplement
// parce qu'il traverse une frontière entre deux services.
//
// DEither.Left<"async-error", DDataStructure.ErrorPromise>
// | DEither.Left<"map-error", DDataStructure.Error>
// | (DModeling.ObjectTag<"EmailNotification"> & {
//     readonly email: string;
//     readonly subject: string;
// })
const mappedEmailNotification = DCommon.pipe(
	EmailNotification.map({
		email: "user@example.com",
		subject: "Account created",
	}),
	DEither.unwrapRight,
);

// `decodeMap` suit le même principe que `map`, mais commence par décoder
// la représentation externe avec les codecs fournis.
//
// Ici, `attempts` provient par exemple d'une représentation string avant
// de retrouver son type métier `number`.

// DEither.Left<"async-error", DDataStructure.ErrorPromise>
// | DEither.Left<"map-error", DDataStructure.Error>
// | DEither.Right<"map-success", SmsNotification>
const maybeSmsNotification = SmsNotification.decodeMap(
	DDataStructure.codecsString,
	{
		phone: "+33600000000",
		message: "Account created",
		attempts: DCommon.cast("1"),
	},
);

// `update` reconstruit un `TaggedObject` possédant la même identité
// en remplaçant uniquement les propriétés fournies.
//
// Comme pour les autres structures de modeling, `undefined` ne remplace
// pas une propriété déjà présente.
const updatedSmsNotification = SmsNotification.update(
	SmsNotification.new({
		phone: "+33600000000",
		message: "Account created",
		attempts: 1,
	}),
	{
		attempts: 2,
	},
);

// Les variantes `asyncMap` et `asyncDecodeMap` permettent la même
// hydratation lorsqu'une structure contient des traitements asynchrones.
