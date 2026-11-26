/**
 * @title controlBodyAsFormData
 *
 * Lire un body multipart avec des limites adaptées aux champs et fichiers.
 */
import { controlBodyAsFormData, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({
		maxFileQuantity: 3,
		mimeType: ["image/png", "image/jpeg"],
		bodyMaxSize: "10mb",
		fileMaxSize: "3mb",
		textFieldMaxSize: "64kb",
		maxBufferSize: "128kb",
		maxIndexArray: 100,
		maxKeyLength: 200,
	}),
})
	.extract({
		body: {
			title: DDataStructure.string(),
			files: DDataStructure.array(DSDataStructure.file()),
		},
	})
	.handler(
		({ title, files }, { response }) => response.ok(
			"documents.received",
			{
				title,
				files,
			},
		),
	);

// maxFileQuantity est obligatoire ; mimeType accepte aussi une chaîne ou une
// RegExp. Les tailles acceptent des octets ou une unité. maxBufferSize limite
// le tampon, maxIndexArray et maxKeyLength encadrent les clés structurées.
// Par défaut : 128kb, 500 et 500 respectivement. Les champs sont validés par
// les structures et les codecs du lecteur ; les fichiers utilisent une structure
// File de server. Le connecteur doit fournir un lecteur compatible.
// Cette option remplace le contrôleur du Hub.
