# Fondamentaux.

## Contraintes de typage

Garanties sur les valeurs : acquisition, composition, propagation, compatibilité statique et contraintes personnalisées.


### Acquisition des contraintes.

Vérification runtime et narrowing vers un type contraint.
 

```ts
import * as DNumber from "@duplojs/lang/number";

// Une contrainte existe uniquement dans le typage : elle ne modifie ni ne valide la valeur.
// L’intersection compose ici deux garanties établies par les predicates.
type Age = number & DNumber.Integer & DNumber.Positive;

// @ts-expect-error Le littéral seul ne porte pas les contraintes attendues.
const age: Age = 12;

// Chaque vérification réussie enrichit le type sans changer la valeur runtime.
const maybeAge = 12;
if (
	DNumber.isInteger(maybeAge)
	&& DNumber.isPositive(maybeAge)
) {
	const age: Age = maybeAge;
}
```

### [Composition des contraintes fournies.](ai-docs/src/01-fundamental/01-constraint/10-built-in-constraint.ts)

Réutilisation et composition des contraintes disponibles dans les domaines.
 

### [Manipulation des valeurs contraintes.](ai-docs/src/01-fundamental/01-constraint/20-manipulation.ts)

Exploitation des contraintes par les fonctions DuploJS pour simplifier la manipulation des valeurs.
 

### [Compatibilité statique des contraintes.](ai-docs/src/01-fundamental/01-constraint/30-cast.ts)

Cast par implication, valeurs littérales et inférence en contexte générique.
 

### [Contraintes personnalisées.](ai-docs/src/01-fundamental/01-constraint/40-custom-constraint.ts)

Déclaration, predicate de validation et extension des règles de cast.
 
## Currification

Composition des transformations de données avec les fonctions DuploJS : pipes, callbacks et traitements asynchrones.


### Currification et composition avec pipe.

Configurer les opérations avant de recevoir la donnée et enchaîner ses transformations.
 

```ts
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

// La forme curifiée reçoit les paramètres, puis la donnée transmise par pipe.
// Privilégier pipe dès qu’une donnée subit plusieurs transformations,
// ou si le traitement est susceptible d’en accueillir d’autres.
// Utiliser en priorité les fonctions fournies par l’écosystème.
const normalizedTags = DCommon.pipe(
	" TypeScript, DuploJS, Functional " as const,
	// Configure le séparateur ; pipe fournit ensuite la chaîne.
	DString.split(","),
	// Configure la transformation ; pipe fournit le tableau.
	DArray.map(DString.trim),
	DArray.filter(DString.isNotEmpty),
	DArray.map(DString.toLowerCase),
);
// Résultat : ["typescript", "duplojs", "functional"].
// Chaque étape reçoit la sortie précédente ; les types suivent ces transformations.
// On peut ajouter, retirer ou réordonner les étapes sans restructurer le traitement.
```

### [Réutilisation des fonctions de l’écosystème dans les pipes.](ai-docs/src/01-fundamental/02-currying/10-built-in-function.ts)

Composer les opérations fournies, sous forme curifiée ou directement compatible avec pipe.
 

### [Composition dans une callback.](ai-docs/src/01-fundamental/02-currying/20-inner-pipe.ts)

Enchaîner des transformations lorsque la fonction appelante attend une fonction.
 

### [Composition de traitements asynchrones.](ai-docs/src/01-fundamental/02-currying/30-async-pipe.ts)

Enchaîner des étapes synchrones et asynchrones dans un pipe ou une callback.
 
## Either

Résultats et états contextualisés : représentation, discrimination, traitement exhaustif, propagation des échecs et adaptation des contrats.


### Représentation des résultats avec Either.

Statuts Right et Left, information contextuelle et valeur associée.
 

```ts
import * as DEither from "@duplojs/lang/either";

// Un résultat porte un statut, une information qui identifie le cas et une valeur.
const result = DEither.right("user-found", { name: "Alice" });
const missing = DEither.left("user-not-found");

// Les variantes fournies reposent sur Right (Success, Some, Result, Ok) ou Left
// (Fail, Error, None).
// Result décrit un état contextualisé sans décider s’il constitue un succès ou un échec.
// Un contrat exprime les résultats possibles par une union, avec des informations
// personnalisées ou des variantes fournies.
type FindUserResult = DEither.Right<"user-found", { name: "Alice" }> | DEither.Left<"user-not-found", undefined>;
```

### [Discrimination et extraction des résultats.](ai-docs/src/01-fundamental/03-either/10-discrimination.ts)

Choisir une branche par statut ou information, extraire sa valeur et traiter les autres cas.
 

### [Décisions exhaustives sur les résultats.](ai-docs/src/01-fundamental/03-either/20-exhaustive-handling.ts)

Sélection et traitement de chaque variante pour détecter les évolutions du contrat.
 

### [Composition avec propagation des échecs.](ai-docs/src/01-fundamental/03-either/30-composition.ts)

Enchaîner ou regrouper des opérations en arrêtant le traitement au premier Left.
 

### [Adaptation des résultats au contexte.](ai-docs/src/01-fundamental/03-either/40-result-adaptation.ts)

Reclasser les statuts et renommer les informations en conservant les valeurs.
 

### [Conversion des absences et exceptions en résultats.](ai-docs/src/01-fundamental/03-either/50-external-results.ts)

Intégrer des valeurs optionnelles ou des appels pouvant échouer dans un contrat Either.
 

### [États contextualisés avec Result.](ai-docs/src/01-fundamental/03-either/60-contextual-state.ts)

Décrire et discriminer des états sans leur attribuer un sens de succès ou d’échec.
 
## DataStructure

Contrats de données partagés entre TypeScript et runtime : composition, validation, contraintes, représentations, récursivité et erreurs.


### Contrats de données avec DataStructure.

Décrire les données attendues et obtenir des valeurs typées après validation.
 

```ts
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";

// Une structure porte le même contrat dans TypeScript et au runtime.
// L’utiliser aux frontières du logiciel pour vérifier les données encore inconnues.
const userStructure = DDataStructure.object({
	name: DDataStructure.string(),
	email: DDataStructure.string([DDataStructure.email()]),
});
type User = DDataStructure.StructureValue<typeof userStructure>;

declare const input: unknown;
const result = userStructure.check(input);
if (DEither.isRight(result)) {
	const user: User = DEither.unwrapRight(result);
}
// Un Left conserve une erreur structurée lorsque la validation échoue.
```

### [Composition des contrats de données.](ai-docs/src/01-fundamental/04-data-structure/10-structure.ts)

Construire et réutiliser des structures pour décrire des données simples ou composées.
 

### [Contraintes de validation dans les structures.](ai-docs/src/01-fundamental/04-data-structure/20-constraint.ts)

Ajouter et cumuler des contraintes compatibles, fournies ou personnalisées.
 

### [Validation des données entrantes.](ai-docs/src/01-fundamental/04-data-structure/30-validation.ts)

Vérification, conversion et narrowing aux frontières du logiciel, en synchrone ou asynchrone.
 

### [Changement de représentation avec des codecs.](ai-docs/src/01-fundamental/04-data-structure/40-codecs.ts)

Encoder et décoder les données avec un même contrat, selon leur type fondamental.
 

### [Contrats de données récursifs.](ai-docs/src/01-fundamental/04-data-structure/50-recursive.ts)

Références différées et cohérence entre un type déclaré et sa structure runtime.
 

### [Interprétation des erreurs de validation et de conversion.](ai-docs/src/01-fundamental/04-data-structure/60-interpret-error.ts)

Localiser les données invalides et adapter les messages au contexte ou à la langue.
 
## Chrono

Représentation des instants et durées : création, calculs, comparaison, sérialisation et fuseaux horaires.


### Représentation des instants et des durées.

TheDate et TheTime pour modéliser le temps avec des valeurs immuables.
 

```ts
import * as DChrono from "@duplojs/lang/chrono";

// TheDate représente un instant absolu ; TheTime une durée ou une quantité de temps.
// Privilégier ces types aux Date et number natifs dans le domaine pour rendre ce sens explicite.
const instant = DChrono.createDate("2026-09-30");
const duration = DChrono.createTime(2, "hour");

// La transformation produit un nouvel instant ; la valeur initiale reste inchangée.
const later = DChrono.addTime(instant, duration);
```

### [Création des instants et des durées.](ai-docs/src/01-fundamental/05-chrono/10-creation.ts)

Valeurs connues statiquement ou reçues au runtime, et gestion des entrées invalides.
 

### [Calculs et comparaisons temporels.](ai-docs/src/01-fundamental/05-chrono/20-manipulation.ts)

Transformer, comparer et décomposer des instants ou durées avec les fonctions Chrono.
 

### [Transport et reconstruction des valeurs temporelles.](ai-docs/src/01-fundamental/05-chrono/30-serialized.ts)

Sérialiser, reconnaître et reconstruire les instants et durées en conservant leur valeur.
 

### [Interprétation et affichage dans un fuseau horaire.](ai-docs/src/01-fundamental/05-chrono/40-timezone.ts)

Interpréter une heure locale et lire ou présenter un instant dans le fuseau demandé.
 
## Modélisation

Identités métier, modèles de données, états et transitions, preuves de passage et identité des opérations dans les contrats.


### [Identité et contraintes des types métier.](ai-docs/src/01-fundamental/06-modeling/10-new-type.ts)

Distinguer des valeurs de même représentation par des NewType propres à leur rôle métier.
 

### [Entités métier et hydratation.](ai-docs/src/01-fundamental/06-modeling/20-entity.ts)

Déclarer les propriétés métier, hydrater les données externes et mettre à jour les valeurs typées.
 

### [Objets taggés et unions discriminées.](ai-docs/src/01-fundamental/06-modeling/30-tagged-object.ts)

Identité transportable, distinction des formes d’un objet et hydratation des données brutes.
 

### [Cycle de vie des entités.](ai-docs/src/01-fundamental/06-modeling/40-entity-lifecycle.ts)

États, préconditions et transitions métier représentés par des Flag et des Fact.
 

### [Preuves de passage par une opération.](ai-docs/src/01-fundamental/06-modeling/50-evidence.ts)

Exiger dans les types qu’une valeur soit passée par un traitement préalable.
 

### [Identité des fonctions dans les dépendances.](ai-docs/src/01-fundamental/06-modeling/60-signed-function.ts)

Exiger une fonction identifiée au-delà de sa seule signature TypeScript.
 
## Discrimination

Sélection et affinement des types dans les unions : identité, valeurs littérales, forme ou prédicats, traitement exhaustif ou partiel.


### [Discrimination des entités par identité.](ai-docs/src/01-fundamental/07-discrimination/10-entity.ts)

Sélection exhaustive ou partielle selon le nom métier, avec typage précis des branches.
 

### [Discrimination selon le fait courant.](ai-docs/src/01-fundamental/07-discrimination/20-fact.ts)

Choisir une branche selon la Fact portée par une valeur et accéder aux données du fait.
 

### [Discrimination des objets par tag.](ai-docs/src/01-fundamental/07-discrimination/30-tagged-object.ts)

Identifier la forme d’un objet par son tag et traiter tout ou partie de l’union.
 

### [Discrimination des valeurs littérales.](ai-docs/src/01-fundamental/07-discrimination/40-literal.ts)

Traitement exhaustif ou partiel d’une union selon la valeur, avec branches typées.
 

### [Discrimination par la forme des données.](ai-docs/src/01-fundamental/07-discrimination/50-shape.ts)

Sélectionner les variantes sans identité explicite par des patterns, y compris imbriqués.
 

### [Discrimination par prédicats et élimination.](ai-docs/src/01-fundamental/07-discrimination/60-predicate.ts)

Affiner les branches et réduire les cas restants, avec sélection positive ou inverse.
 
# Serveur

## Manipuler des fichiers

Accès cross-platform au système de fichiers : chemins typés avec `Path`, opérations sur fichiers/dossiers/liens et erreurs représentées par `Either`.


### [Manipuler le système de fichiers](ai-docs/src/02-server/10-file/10-manipulation.ts)

Lecture, écriture et opérations de système de fichiers avec chemins typés et résultats `Either`.
 

### [Chemins typés](ai-docs/src/02-server/10-file/20-path.ts)

Contraintes `Path`, `Absolute` et `Segment` pour valider, extraire et résoudre des chemins Unix.
 
## HTTP

Interfaces HTTP côté serveur : réception et validation des requêtes, orchestration des traitements et contrats de réponse typés partageables avec les clients.


### [Créer une application HTTP](ai-docs/src/02-server/20-http/10-init.ts)

Configuration d'un `Hub`, plugins et enregistrement des routes d'une application HTTP.
 

### [Créer une route HTTP](ai-docs/src/02-server/20-http/20-route.ts)

Construction du flux d’une route : entrées validées, contexte de traitement et réponses contextualisées.
 

### [Faire une routine de vérification](ai-docs/src/02-server/20-http/30-routine.ts)

Vérifications dans les flux HTTP, réutilisation des traitements et adaptation de leurs résultats au contexte.
 

### [Définir une politique de gestion de tokens](ai-docs/src/02-server/20-http/40-jwt.ts)

Déclaration d'une politique unique pour créer et vérifier une famille de tokens.
 

### [Comment partager des ressources](ai-docs/src/02-server/20-http/50-codegen.ts)

Génération du typage des routes et des `DataStructure` pour partager un contrat statique.
 
## Environnement

Exploitation des capacités de l’environnement serveur et adaptation aux API des différentes plateformes d’exécution.


### [Capacités de plateforme](ai-docs/src/02-server/30-environment/10-platform.ts)

Utilisation des abstractions communes et des connecteurs pour garder le code
applicatif indépendant du runtime.
 

### [Manipuler les variables d'environnement](ai-docs/src/02-server/30-environment/20-variable.ts)

Chargement de sources d'environnement, validation par `DataStructure` et
obtention d'une configuration typée.
 
## Créer des commandes

Création d’interfaces en ligne de commande (CLI) pour les applications serveur.


### [Définir une commande](ai-docs/src/02-server/40-command/10-use.ts)

Définition des entrées et du traitement d’une commande CLI.
 

### [Créer des sous-commandes](ai-docs/src/02-server/40-command/20-sub-command.ts)

Composition de commandes sous forme d'arbre pour router l'exécution vers
une branche spécialisée.
 
# Client

## Client HTTP

Communication typée avec des API HTTP.


### [Initialiser un client HTTP](ai-docs/src/03-client/10-http/10-init.ts)

Création d'un client à partir du contrat statique des routes, configuration
globale et conservation du typage des requêtes et réponses exposées par le
serveur.
 

### [Effectuer une requête HTTP](ai-docs/src/03-client/10-http/20-request.ts)

Envoi de données et traitement des réponses typées d’une API HTTP.
 

### [Utiliser les hooks du client HTTP](ai-docs/src/03-client/10-http/30-hook.ts)

Comportements transversaux et instrumentation du cycle des échanges HTTP.
 
## Form

Création et gestion de formulaires typés pour les interfaces utilisateur.


### [Créer un formulaire](ai-docs/src/03-client/20-form/10-init.ts)

Initialisation et cycle de vie d’un formulaire Vue typé.
 

### [Inputs de formulaire réutilisables](ai-docs/src/03-client/20-form/20-input.ts)

Création, intégration et validation des champs de saisie d’un formulaire Vue.
 

### [Composer avec les layouts](ai-docs/src/03-client/20-form/30-layout.ts)

Composition de la structure des données et des comportements d’un formulaire.
 

### [Personnaliser les templates](ai-docs/src/03-client/20-form/40-template.ts)

Personnalisation globale ou locale du rendu Vue des formulaires et de leurs champs.
 
# Tests

## Tests unitaires

Vérification du comportement et du typage des unités de code.


### [Tester un résultat Either](ai-docs/src/04-tests/01-unit/10-either.ts)

Vérification des branches, des valeurs et du typage d’un contrat Either.
 
## Tests E2E

Vérification des parcours utilisateur dans une application web.


### [Initialiser le client E2E](ai-docs/src/04-tests/02-e2e/10-init.ts)

Configuration de l’environnement de test et intégration du site aux fixtures Playwright.
 

### [Architecturer une suite E2E](ai-docs/src/04-tests/02-e2e/20-architecture.ts)

Organisation d’une suite E2E selon les pages et les composants du site testé.
 

### [Ecrire un parcours de test](ai-docs/src/04-tests/02-e2e/30-testing.ts)

Scénarios utilisateur, interactions et vérifications avec les objets du site.
 
