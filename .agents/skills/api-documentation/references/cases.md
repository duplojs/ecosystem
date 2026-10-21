# Cas de référence

Ces cas illustrent des critères de qualité ; leurs fonctions, données et formulations ne sont pas un catalogue à reproduire pour une autre cible. Ils servent à calibrer la méthode, pas à générer des pages publiques sans demande. Ils ont été choisis dans les déclarations de `docs/libs/v1/lang/dist/` ; revérifier ces contrats lorsque l'instantané change. Les chemins de futures pages indiqués ci-dessous sont des destinations à calculer, pas des liens publiables avant leur création.

## A — Fonction simple : DCommon.forward

Preuves : `common/index.d.ts` réexporte `forward.d.ts` ; la source courante correspondante est `packages/lang/scripts/common/forward.ts`.

```ts
export declare function forward<
	GenericValue extends unknown,
>(
	value: GenericValue,
): GenericValue;
```

Décisions attendues : une introduction courte (« retourne la valeur reçue »), un exemple direct montrant la conservation du type et de la référence pour un objet, un seul bloc de syntaxe, une ligne pour `value`, puis le retour. Aucun chapitre de théorie, forme curifiée ou point d'attention artificiel. Ne pas qualifier l'opération de copie.

Exemple à compiler contre l'alias de version, sans page publique pendant un contrôle du skill :

```ts
import * as DCommon from "@duplojs-v1/lang/common";

const user = { name: "Alice" };
const result = DCommon.forward(user);
//    ^?
```

Destination initiale : `docs/fr/v1/api/lang/common/forward.md`, exemple homologue sous `docs/examples/v1/api/lang/common/`. Si les index manquent, créer leur minimum factuel ; ne pas étendre la page package.

## B — Surcharges : DArray.filter

Preuves : `array/index.d.ts`, `array/filter.d.ts`, son type `FilterPredicateFunctionParams` et le calcul de `ReapplyCompatiblesConstraints` dans `array/constraints/`. Complément sémantique : entrée `DArray.filter` dans le routeur Array d'AgentKit et son exemple lié.

Décisions attendues : quatre capacités existent bien dans l'instantané initial. Présenter curifiée/type guard, curifiée/booléen, directe/type guard, directe/booléen ; cet ordre diffère de l'ordre du fichier de déclarations. Utiliser deux titres de forme et deux sous-titres de capacité par forme, avec un bloc par variante. Aérer les génériques et paramètres selon le modèle éditorial, sans paragraphe expliquant le principe des deux formes. Ne pas recopier la signature d'implémentation. Décrire les paramètres `element`, `{ index, self }`, la sélection et l'affinement du type des éléments.

Pour concevoir l'exemple, lire `packages/agents-kit/docs/API/10-lang/10-array/10-filter.ts` via le routeur. Les usages et assertions de cette référence permettent de repérer la sélection, l'affinement et la conservation d'une borne maximale. Vérifier leur compatibilité avec l'instantané, puis choisir les observations Twoslash utiles à la page ; ne pas reproduire les assertions dans le code visible ni ajouter un traitement principalement consacré à une autre API.

Le retour peut perdre une garantie de minimum ou de longueur exacte. `FilterOutput` est un alias interne : sa présentation doit rendre la structure du résultat et ses garanties lisibles sans le présenter comme un import public. Les paramètres de callback méritent une explication ; le graphe complet du calcul de compatibilité n'a pas à être recopié.

## C — Contraintes : DArray.at

Preuves : `array/index.d.ts` → `array/at/index.d.ts` → `array/at/default.d.ts`. Le type public `At<Array, Index>` distingue indice couvert, hors limites prouvées et accès incertain. Consulter les concepts de contraintes d'AgentKit et `skills/fundamental/references/constraints-and-validation.md` ; vérifier les exemples contre l'instantané avant réutilisation.

```ts
import * as DArray from "@duplojs-v1/lang/array";

const values: readonly number[] = [10, 20, 30];

const uncertain = DArray.at(values, 1);
//    ^?




if (DArray.minElements(values, 2)) {
	const second = DArray.at(values, 1);
	//    ^?




	const later = DArray.at(values, 10);
	//    ^?




}
```

L'espacement après les marqueurs réserve de la place aux fenêtres de types ; vérifier leur ouverture dans le rendu et ajuster si elles masquent encore une ligne utile.

Attendu : accès initial `number | undefined`, accès `second` garanti `number`, accès `later` encore `number | undefined`. La contrainte est acquise par le prédicat ; elle ne vient pas d'une assertion. Présenter les formes curifiée et directe réelles, puis l'effet des contraintes sur le retour sans réécrire un guide de validation.

Points à éviter : promettre qu'un minimum de deux couvre l'indice 10 ; supprimer un `undefined` provenant du type propre des éléments ; affirmer que `at` valide le tableau ou retourne un Either ; recopier une ancienne convention d'un autre package. L'exemple complémentaire peut montrer un hors-limites prouvé si cette branche doit être explicitée.

## D — Insertion et retour au sommaire

Prendre un sommaire d'index I ordonné par groupes, puis vérifier ces états sans modifier les autres contenus des pages :

| État du sommaire | Liens attendus |
| --- | --- |
| Une seule fonction A | `A.prev = I`, `A.next = I` |
| A puis B | `A.prev = I`, `A.next = B`, `B.prev = A`, `B.next = I` |
| Insertion de N entre A et B | `A.next = N`, `N.prev = A`, `N.next = B`, `B.prev = N` ; bornes vers I conservées |
| Ajout de N avant A | `N.prev = I`, `N.next = A`, `A.prev = N` |
| Ajout de N après B | `B.next = N`, `N.prev = B`, `N.next = I` |

Répéter le cas d'insertion à la frontière de deux groupes : le changement de catégorie ne coupe pas le parcours. Vérifier les métadonnées de l'index touché et le maintien des contenus éditoriaux existants. Ces états décrivent la navigation des fonctions ; ils n'imposent aucun footer particulier à I.

## Contrôler la méthode sans publier

Lors d'une révision du skill, produire les essais dans un dossier temporaire isolé, en conservant la résolution depuis `docs/`. Compiler les exemples concernés des cas A à C et vérifier les types montrés avec les options documentaires. Tester les annotations nouvelles et un diagnostic intentionnel dans le pipeline réel lorsqu'ils sont concernés par la révision, puis contrôler les états de navigation du cas D. Ne pas laisser les fixtures, pages ou caches de ces essais dans la documentation livrée.

Les critères sont les contrats observés, la justesse des décisions éditoriales, l'intégration et la validation. La présence mécanique de titres ne prouve pas la qualité du skill ; ces cas ne mesurent pas un taux de réussite sur des centaines de fonctions.
