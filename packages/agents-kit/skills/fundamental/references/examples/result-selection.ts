/**
 * @title Sélectionner les résultats selon l'opération.
 *
 * Constater un état, sélectionner les issues utiles et conserver les refus.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

interface Item {
	id: string;
	enabled: boolean;
}

function classifyItem(item: Item) {
	if (item.enabled) {
		return DEither.result("ready", item);
	}

	return DEither.result("blocked", item);
}

function prepareItem(item: Item) {
	const selected = DCommon.pipe(
		item,
		classifyItem,
		DEither.keepAsRightByInformation("ready"),
		DEither.unwrapRight,
	);

	// unwrapRight conserve le Left : la garde peut suivre l'extraction.
	if (DEither.isLeft(selected)) {
		return selected;
	}

	return DEither.right("prepared", selected);
}

type _CheckPrepared = DCommon.ExpectType<
	ReturnType<typeof prepareItem>,
	DEither.Left<"blocked", Item> | DEither.Right<"prepared", Item>,
	"strict"
>;

declare function loadItem(id: string): Promise<DEither.Maybe<Item>>;
declare function saveItem(item: Item): Promise<DEither.Right<"saved", Item>>;

const saved = await DEither.rightAsyncPipe(
	loadItem("item"),
	// L'inner pipe intervient après la recherche, à une étape intermédiaire.
	DCommon.innerPipe(
		classifyItem,
		DEither.keepAsRightSelection({
			ready: true,
			blocked: false,
		}),
	),
	// L'étape extérieure reçoit l'Item déballé ; un Left évite cet appel.
	(item) => saveItem(item),
);

type _CheckSaved = DCommon.ExpectType<
	typeof saved,
	DEither.None | DEither.Left<"blocked", Item> | DEither.Right<"saved", Item>,
	"strict"
>;
