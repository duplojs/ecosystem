/**
 * @title controlBodyAsText
 *
 * Sélectionner le lecteur de body textuel et sa limite de taille.
 */
import { controlBodyAsText, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

useRouteBuilder("POST", "/messages", {
	bodyController: controlBodyAsText({ bodyMaxSize: "1mb" }),
})
	.extract({
		body: DDataStructure.string(),
	})
	.handler(
		({ body }, { response }) => response.ok("message.received", { body }),
	);

// La taille peut être exprimée en octets ou avec une unité. Sans limite locale,
// le lecteur utilise sa limite configurée par le serveur. Avec le lecteur Node,
// text/plain produit du texte et application/json est décodé en JSON avant
// validation ; un contenu invalide ou illisible déclenche le refus d'extraction.
// La compatibilité et les détails de lecture dépendent du connecteur.
// Le contrôleur local remplace celui du Hub.
