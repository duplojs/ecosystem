/**
 * @title Identité et contraintes des types métier.
 *
 * Distinguer des valeurs de même représentation par des NewType propres à leur rôle métier.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Un NewType associe une identité de typage à une structure et à des contraintes métier.
// Cette identité ne modifie pas la représentation runtime de la valeur.
const SenderEmail = DModeling.createNewType(
	"SenderEmail",
	DDataStructure.string(),
	[DDataStructure.email()],
);
type SenderEmail = DDataStructure.StructureValue<typeof SenderEmail>;

const RecipientEmail = DModeling.createNewType(
	"RecipientEmail",
	DDataStructure.string(),
	[DDataStructure.email()],
);
type RecipientEmail = DDataStructure.StructureValue<typeof RecipientEmail>;

// map vérifie la structure et les contraintes avant de produire le type métier.
// Un échec reste représenté par un Either ; OrThrow est utilisé ici pour des constantes connues.
const sender = DEither.unwrapRightOrThrow(SenderEmail.map("alice@example.com"));
const recipient = DEither.unwrapRightOrThrow(RecipientEmail.map("bob@example.com"));

declare function sendMessage(sender: SenderEmail): void;

sendMessage(sender);

// @ts-expect-error Une adresse destinataire ne possède pas l’identité SenderEmail.
sendMessage(recipient);

// @ts-expect-error Une string seule ne possède pas l’identité métier attendue.
sendMessage("alice@example.com");

// Les deux types reposent sur la même représentation, mais leurs rôles ne sont pas interchangeables.
// Le namespace d’une Entity peut aussi créer des NewType préfixés par le nom de cette entité.
