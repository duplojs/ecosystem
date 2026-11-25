/**
 * @title DModeling — TaggedObject
 *
 * Représenter des objets identifiables, leurs propriétés et leurs appartenances à des groupes.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";
import * as DArray from "@duplojs/lang/array";
import type * as DString from "@duplojs/lang/string";
import type * as DEither from "@duplojs/lang/either";

// Le tag donne à l'objet une identité au runtime, sérialisable avec ses propriétés.
const HeadingNode = DModeling.createTaggedObject("HeadingNode", {
	title: DDataStructure.string([DDataStructure.minCharacters(2)]),
	anchor: DDataStructure.string(),
});
const LinkNode = DModeling.createTaggedObject("LinkNode", {
	label: DDataStructure.string(),
	target: DDataStructure.string(),
});
type HeadingNode = DDataStructure.StructureValue<typeof HeadingNode>;
type LinkNode = DDataStructure.StructureValue<typeof LinkNode>;
type _CheckHeadingNode = DCommon.ExpectType<
	HeadingNode,
	DModeling.ObjectTag<"HeadingNode"> & {
		readonly title: string & DString.MinCharacters<2>;
		readonly anchor: string;
	},
	"strict"
>;

const link = LinkNode.new({
	label: "Guide",
	target: "/guide",
});
const linkTag = DModeling.getTagValue(link);
type _CheckLinkTag = DCommon.ExpectType<
	typeof linkTag,
	"LinkNode",
	"strict"
>;

// Les nœuds peuvent former une union et leur identité permet de choisir le
// traitement propre à chaque forme. Le matching exige une branche par tag.
type DocumentNode = HeadingNode | LinkNode;
declare const node: DocumentNode;
const tag = DModeling.getTagValue(node);
type _CheckTag = DCommon.ExpectType<
	typeof tag,
	"HeadingNode" | "LinkNode",
	"strict"
>;
const label = DPattern.matchWithTaggedObject(node, {
	HeadingNode: (heading) => heading.title,
	LinkNode: (linkNode) => linkNode.label,
});
type _CheckLabel = DCommon.ExpectType<
	typeof label,
	string | (string & DString.MinCharacters<2>),
	"strict"
>;
if (DModeling.hasTagValue(node, "LinkNode")) {
	type _CheckLinkBranch = DCommon.ExpectType<
		typeof node,
		LinkNode,
		"strict"
	>;
}
const selected = DCommon.pipe(
	node,
	DCommon.when(DModeling.hasTagValue("LinkNode"), (linkNode) => linkNode.target),
);
type _CheckSelected = DCommon.ExpectType<
	typeof selected,
	string | HeadingNode,
	"strict"
>;

// map ajoute l'identité aux données brutes et vérifie les propriétés ; un titre
// trop court produit un Left « map-error ». new attend des propriétés déjà typées.
const mapped = HeadingNode.map({
	title: "Guide",
	anchor: "guide",
});
const rejected = HeadingNode.map({
	title: "A",
	anchor: "guide",
});
type _CheckMapped = DCommon.ExpectType<
	typeof mapped,
	| DEither.Right<"map-success", HeadingNode>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"map-error", DDataStructure.Error>,
	"strict"
>;
type _CheckRejected = DCommon.ExpectType<
	typeof rejected,
	typeof mapped,
	"strict"
>;
declare const title: string & DString.MinCharacters<2>;
const heading = HeadingNode.new({
	title,
	anchor: "guide",
});
type _CheckNew = DCommon.ExpectType<
	typeof heading,
	HeadingNode,
	"strict"
>;

// update conserve l'identité et reconstruit l'objet sans valider les nouvelles
// propriétés. Une valeur undefined laisse la propriété précédente inchangée.
declare const replacement: (string & DString.MinCharacters<2>) | undefined;
const updated = HeadingNode.update(heading, { title: replacement });
const updatedInPipe = DCommon.pipe(
	heading,
	HeadingNode.update({ title: replacement }),
);
type _CheckUpdated = DCommon.ExpectType<
	typeof updated,
	HeadingNode,
	"strict"
>;
type _CheckUpdatedInPipe = DCommon.ExpectType<
	typeof updatedInPipe,
	HeadingNode,
	"strict"
>;

// decodeMap décode les propriétés avec les codecs avant le mapping. Les variantes
// asynchrones attendent les validations asynchrones, sans Left « async-error ».
const decoded = HeadingNode.decodeMap(DDataStructure.codecsString, {
	title: "Guide",
	anchor: "guide",
});
const decodedInPipe = DCommon.pipe(
	{
		title: "Guide",
		anchor: "guide",
	},
	HeadingNode.decodeMap(DDataStructure.codecsString),
);
const asyncMapped = HeadingNode.asyncMap({
	title: "Guide",
	anchor: "guide",
});
const asyncDecoded = HeadingNode.asyncDecodeMap(DDataStructure.codecsString, {
	title: "Guide",
	anchor: "guide",
});
type _CheckDecoded = DCommon.ExpectType<
	typeof decoded,
	typeof mapped,
	"strict"
>;
type _CheckDecodedInPipe = DCommon.ExpectType<
	typeof decodedInPipe,
	typeof mapped,
	"strict"
>;
type _CheckAsyncMapped = DCommon.ExpectType<
	typeof asyncMapped,
	Promise<DEither.Right<"map-success", HeadingNode> | DEither.Left<"map-error", DDataStructure.Error>>,
	"strict"
>;
type _CheckAsyncDecoded = DCommon.ExpectType<
	typeof asyncDecoded,
	typeof asyncMapped,
	"strict"
>;

// Les groupes permettent de reconnaître des appartenances communes à plusieurs
// objets, tout en conservant leur tag identifiable. Chaque groupe peut aussi exiger
// des propriétés partagées. Un objet peut appartenir à plusieurs groupes indépendants :
// ici les événements sont regroupés à la fois par sujet et par opération.
interface UserGroup extends DModeling.ObjectTagGroup<"user", { readonly userId: string }> {}
interface OrderGroup extends DModeling.ObjectTagGroup<"order", { readonly orderId: string }> {}
interface CreatedGroup extends DModeling.ObjectTagGroup<"created"> {}
interface DeletedGroup extends DModeling.ObjectTagGroup<"deleted"> {}
interface UserCreated extends DModeling.ObjectTagWithGroup<"event", readonly [UserGroup, CreatedGroup]> {}
interface UserDeleted extends DModeling.ObjectTagWithGroup<"event", readonly [UserGroup, DeletedGroup]> {}
interface OrderCreated extends DModeling.ObjectTagWithGroup<"event", readonly [OrderGroup, CreatedGroup]> {}
type Event = UserCreated | UserDeleted | OrderCreated;

// Les noms des groupes composent le tag dans l'ordre déclaré. taggedObject et la
// fabrique ajoutent le tag à des propriétés déjà typées, sans validation runtime.
const userCreated = DModeling.taggedObject<UserCreated>("[user][created]event", { userId: "u1" });
const makeOrderCreated = DModeling.createTaggedObjectFactory<OrderCreated>("[order][created]event");
const orderCreated = makeOrderCreated({ orderId: "o1" });
type _CheckUserCreated = DCommon.ExpectType<
	typeof userCreated,
	UserCreated,
	"strict"
>;
type _CheckOrderCreated = DCommon.ExpectType<
	typeof orderCreated,
	OrderCreated,
	"strict"
>;
// @ts-expect-error Le groupe user exige la propriété userId.
DModeling.taggedObject<UserCreated>("[user][created]event", {});

// On peut aussi lier une structure à un type groupé existant pour valider sa shape.
const UserCreatedStructure = DModeling.createTaggedObject<UserCreated>("[user][created]event")({
	userId: DDataStructure.string(),
});
const validatedEvent = UserCreatedStructure.map({ userId: "u1" });
type _CheckValidatedEvent = DCommon.ExpectType<
	typeof validatedEvent,
	| DEither.Right<"map-success", UserCreated>
	| DEither.Left<"async-error", DDataStructure.ErrorPromise>
	| DEither.Left<"map-error", DDataStructure.Error>,
	"strict"
>;

// Un même ensemble peut être sélectionné par sujet ou par opération. Un tableau
// de groupes signifie « au moins un de ces groupes », pas leur intersection.
declare const event: Event;
if (DModeling.hasTagGroup(event, "user")) {
	type _CheckUserEvent = DCommon.ExpectType<
		typeof event,
		UserCreated | UserDeleted,
		"strict"
	>;
	const userId = event.userId;
	type _CheckUserId = DCommon.ExpectType<
		typeof userId,
		string,
		"strict"
	>;
}
declare const events: readonly Event[];
const creations = DCommon.pipe(
	events,
	DArray.filter(DModeling.hasTagGroup("created")),
);
type _CheckCreations = DCommon.ExpectType<
	typeof creations,
	readonly (UserCreated | OrderCreated)[],
	"strict"
>;
const selectedEvents = DCommon.pipe(
	events,
	DArray.filter(DModeling.hasTagGroup(["order", "deleted"])),
);
type _CheckSelectedEvents = DCommon.ExpectType<
	typeof selectedEvents,
	readonly (UserDeleted | OrderCreated)[],
	"strict"
>;

// Pour exiger les deux critères, les filtres se composent successivement.
const userCreations = DCommon.pipe(
	events,
	DArray.filter(DModeling.hasTagGroup("user")),
	DArray.filter(DModeling.hasTagGroup("created")),
);
type _CheckUserCreations = DCommon.ExpectType<
	typeof userCreations,
	readonly UserCreated[],
	"strict"
>;
