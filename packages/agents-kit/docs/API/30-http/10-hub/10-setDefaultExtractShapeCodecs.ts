/**
 * @title Hub.setDefaultExtractShapeCodecs
 *
 * Configurer les codecs utilisés pour valider les sources d'extraction hors body.
 */
import { createHub } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Pour chaque source indiquée, les codecs fournis remplacent les précédents.
// Les codecs des autres sources sont conservés. Par défaut, query, params et
// headers utilisent codecsString.
const hub = createHub({ environment: "DEV" })
	.setDefaultExtractShapeCodecs({
		query: DDataStructure.createCodecs({}),
	});

// Ces codecs sont transmis à la validation lors de extract. Le body utilise
// les codecs de son lecteur, pas ceux de cette configuration.
