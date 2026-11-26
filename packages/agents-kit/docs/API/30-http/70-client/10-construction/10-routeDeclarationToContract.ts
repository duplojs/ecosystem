/**
 * @title RouteDeclarationToContract
 *
 * Obtenir le contrat d'une route pour typer les requêtes et les réponses du client.
 */
import { useRouteBuilder, type RouteDeclarationToContract, type FindRouteContract, type FindRouteContractResponse } from "@duplojs/http";
import { createHttpClient, type RouteContractToClientRequestParams, type RouteContractToClientResponse } from "@duplojs/http/client";

const route = useRouteBuilder("GET", "/profile")
	.handler((__, { response }) => response.ok(
		"profile.found",
		{ name: "Ada" },
	));

type Contract = RouteDeclarationToContract<typeof route>;

const client = createHttpClient<Contract>({
	baseUrl: "https://api.example.com",
});

const profile = client
	.get("/profile")
	.iWantInformation("profile.found");

// Le contrat extrait méthode, chemins, paramètres, query, headers, body et
// réponses issues du handler et des étapes. Il ne contient pas les détails
// utilisés pour construire la route. On peut passer une union de déclarations à
// RouteDeclarationToContract, ou une union de contrats à createHttpClient.
// Importer les routes comme types dans une application cliente évite de charger
// leurs modules serveur. Un contrat manuel peut aussi respecter RouteContract.
// FindRouteContract<Routes, Method, Path> sélectionne une route ;
// FindRouteContractResponse<Route, "information" ou "code", Value> sélectionne
// une réponse. Les deux projections client donnent les paramètres et réponses
// correspondants.
type ProfileContract = FindRouteContract<Contract, "GET", "/profile">;
type Found = FindRouteContractResponse<ProfileContract, "information", "profile.found">;
type RequestParams = RouteContractToClientRequestParams<ProfileContract>;
type Response = RouteContractToClientResponse<ProfileContract>;
