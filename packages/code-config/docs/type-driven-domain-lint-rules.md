# Proposition : règles de lint Type-Driven Design

> **Statut : proposition de conception (13 novembre 2026).**
> Ce document conserve les décisions et les pistes discutées pour DuploJS. Aucune règle décrite ici n'est considérée comme implémentée.
> Les noms `domain/*` sont provisoires et les limites signalées doivent être levées par les tests avant d'activer des diagnostics bloquants.

## Objectifs et périmètre

Renforcer par le lint les responsabilités du domaine sans reposer seulement sur le typage des fonctions, tout en offrant des corrections automatiques sur les déclarations répétitives.

Périmètres de référence :

- Exercice : [packages-private/agents-exercises/todo](../../../packages-private/agents-exercises/todo).
- Contrats du domaine : [entités / faits / qualifications](../../agents-kit/docs/concepts/05-type-driven-design/02-domains/10-entities.md), [agrégats](../../agents-kit/docs/concepts/05-type-driven-design/02-domains/20-aggregates.md), [refinements](../../agents-kit/docs/concepts/05-type-driven-design/02-domains/40-refinements.md) et [frontières](../../agents-kit/docs/concepts/05-type-driven-design/01-architecture/10-boundaries.md).
- Cibles techniques envisagées : [plugin Oxlint](../scripts/oxlint/plugin/rules) et [package ESLint](../../eslint).

Les règles doivent reconnaître les appels directs **et** curifiés, notamment lorsqu'une fonction est passée comme étape à `DCommon.pipe`.

## 1. Règles métier retenues (11)

| Règle provisoire | Restriction attendue | Moteur privilégié | Difficulté |
| --- | --- | --- | --- |
| `domain/no-unauthorized-flag-append` | `Flag.append` uniquement dans une fonction `refine*` du namespace de l'entité propriétaire, ou dans une `Fact` qui modifie cette entité. | ESLint avec analyse de symboles/types | Élevée |
| `domain/no-unauthorized-entity-update` | `Entity.update` uniquement dans une `Fact` ciblant la même entité. | ESLint | Moyenne/élevée |
| `domain/no-unauthorized-entity-new` | Proposition stricte : `Entity.new` seulement dans une `Fact` de création, pour le code métier. | ESLint | Moyenne/élevée |
| `domain/no-direct-fact-run` | `Fact.run` seulement depuis un agrégat pour conduire une opération métier (hors tests/fixtures). | ESLint | Moyenne |
| `domain/no-cross-entity-fact` | Une `Fact` peut lire plusieurs entités mais ne crée/met à jour qu'une seule cible : celle de son contrat. | ESLint | Élevée |
| `domain/no-unauthorized-apply-fact` | `applyFact` est utilisé uniquement dans l'implémentation du `createFact` qui le fournit. | Oxlint ou ESLint | Moyenne |
| `domain/no-unsafe-proof-cast` | Détecter les assertions qui prétendent créer un `Flag` ou une `Evidence` sans opération établissant la garantie. | ESLint | Élevée |
| `domain/no-direct-entity-mutation` | Interdire la mutation directe des propriétés d'une entité métier ; passer par un fait et une nouvelle valeur. | ESLint | Élevée |
| `domain/no-side-effects-in-refinement` | Les refinements d'entité ou de contexte sont synchrones et purs : pas de transition, `commit`, `await`, `yield`, mutation ni appel technique impur. | Oxlint pour la syntaxe, ESLint pour les appels | Moyenne/élevée |
| `domain/enforce-layer-boundaries` | Imports autorisés : infrastructure → applications et domain ; applications → domain ; domain n'importe aucune couche supérieure. | Oxlint (imports statiques), ESLint au besoin | Faible/moyenne |
| `domain/no-stale-entity-after-transition` | Après une transition, ne pas réemployer une ancienne version lorsqu'une opération exige l'entité retournée par le fait. | ESLint avec analyse de flot | Très élevée |

### Règle structurante : `Flag.append`

**Seuls deux contextes sont admis** :

1. Une qualification `refine*` **dans le namespace de l'entité qui possède le flag** : `Task.refineState` peut apposer `Task.CompletedFlag`, mais pas `List.OpenFlag`.
2. Une `Fact` de **cette même entité** : `CompleteTaskFact` peut apposer `Task.CompletedFlag`.

Les agrégats, use cases, repositories, adaptateurs et handlers ne doivent pas fabriquer ces flags. Ils consomment la valeur qualifiée ou produite par un fait.

Exemples à détecter, avec les variantes directes, curifiées et les alias d'import :

```ts
// Autorisé uniquement dans Task.refine* ou une Fact de Task :
Task.CompletedFlag.append(task, state);
Task.CompletedFlag.append(state); // fonction curifiée
DCommon.pipe(task, Task.CompletedFlag.append(state));

// Interdit dans un agrégat ou un use case, même si la signature TS passe :
const qualifiedTask = Task.CompletedFlag.append(task, state);

// Interdit dans Task.refine* : flag appartenant à List :
List.OpenFlag.append(list, state);
```

Il faut identifier **le symbole de la factory et son propriétaire**, pas uniquement les noms de fichier ni la chaîne de caractères `append`. Les fonctions curifiées peuvent être passées comme valeurs, stockées ou réexportées. Une règle incapable de résoudre cette provenance ne doit pas produire de faux positif.

### Précisions sur les autres règles métier

- `Entity.update` : reconnaître la cible du `createFact` (troisième générique / définition de l'entité) et les appels qui mutent une autre entité. Une Fact peut recevoir d'autres entités en lecture.
- `Entity.new` : la restriction aux Facts de création correspond à l'intention exprimée pour l'application métier. **À arbitrer** : la documentation fondamentale montre aussi un usage direct de `Entity.new` sur des données préalablement typées, hors d'une Fact. Ne pas activer un interdit global sans avoir défini les exemptions.
- `Fact.run` : les appels comme `DCommon.pipe(params, CreateTaskFact.run, ...)` doivent être couverts. Le périmètre accepté est l'agrégat, pas l'infrastructure ou un use case qui contournerait ce dernier.
- `applyFact` : préserver la provenance de la callback fournie par `createFact`, y compris en cas de destructuring ou de renommage. **Ce n'est pas** une obligation d'appeler `applyFact` sur tous les chemins.
- `no-unsafe-proof-cast` : ne jamais déduire qu'un `as` établit une condition métier. La règle doit distinguer les assertions effectivement liées à des preuves des assertions ordinaires ; elle est non auto-fixable.
- `no-direct-entity-mutation` et `no-stale-entity-after-transition` : cibler les entités de `@duplojs/lang/modeling`, pas tous les objets JS. Le deuxième contrôle est une piste d'analyse de flot et peut rester incomplet.
- `no-side-effects-in-refinement` : la partie syntaxique (fonction `async`, `await`, `yield`, assignation directe, `Entity.update` / `Fact.run` explicites) est accessible à l'AST. La pureté transitive d'une fonction appelée ne peut pas être garantie sans analyse complémentaire. Pas d'avertissement spéculatif.
- `enforce-layer-boundaries` : reconnaître l'architecture du projet, les alias d'import, les imports relatifs et les éventuels réexports. Les limites du domaine ne doivent pas être déduites du seul nom d'un symbole.

## 2. Règles de déclaration et d'auto-fix retenues (4)

| Règle provisoire | Contrôle | Correction attendue |
| --- | --- | --- |
| `domain/consistent-entity-namespace` | Identifier un `namespace` TypeScript contenant `const namespace = DModeling.createEntityNamespace("User")` ; confronter le nom déclaré et le nom du namespace englobant. | Corriger uniquement les incohérences non ambiguës ; sinon signaler. |
| `domain/require-entity-export` | Chaque namespace ainsi reconnu doit déclarer `export const Entity` et `export type Entity`. | Ajouter les `export` / le type manquant ; si aucune entité n'existe, générer un squelette `Entity` et son type. |
| `domain/require-model-type` | Chaque `NewType` et chaque `TaggedObject` déclarés doivent posséder une déclaration de type de **même nom**. | Ajouter le `type` manquant via `DDataStructure.StructureValue<typeof Nom>`. |
| `domain/require-model-type-export` | Dans un namespace d'entité, le type associé à un modèle exporté doit être exporté. | Ajouter `export` à la déclaration existante, sans la dupliquer. |

### Reconnaissance du namespace d'entité

La présence locale de l'appel à `DModeling.createEntityNamespace`, affecté à la variable `namespace`, est le **marqueur de reconnaissance** choisi. Ne pas traiter tous les namespaces TypeScript comme des entités.

```ts
export namespace User {
  const namespace = DModeling.createEntityNamespace("User");

  export const Id = namespace.createNewType("Id", DDataStructure.string());
  export type Id = DDataStructure.StructureValue<typeof Id>;

  export const Entity = namespace.createEntity(() => ({ id: Id }));
  export type Entity = DDataStructure.StructureValue<typeof Entity>;
}
```

Le linter doit tenir compte des imports et alias réels de `@duplojs/lang/modeling` (et éviter de prendre un appel homonyme local pour une factory DuploJS).

### Détection des types existants

Avant toute génération, rechercher dans **la même portée** une déclaration homonyme `type` **ou** `interface`, avant **ou après** la déclaration de la valeur :

```ts
export type PendingState = DModeling.ObjectTag<"PendingState"> & {
  readonly label: string;
};

// Ne pas générer un deuxième type PendingState :
export const PendingState = DModeling.createTaggedObject("PendingState", {
  label: DDataStructure.string(),
});
```

Ne pas écraser une définition manuelle ou imposer `StructureValue` lorsqu'un type explicite existe. Distinguer l'absence de type de l'absence d'`export`.

Les factories concernées sont notamment `namespace.createNewType`, `DModeling.createNewType` et `DModeling.createTaggedObject`. Les valeurs hors namespace suivent leur visibilité actuelle ; l'obligation d'export concerne le namespace d'entité.

### Génération automatique de l'entité

Comportement souhaité lors d'un auto-fix déclenché à l'enregistrement, si le namespace d'entité ne déclare pas encore `Entity` :

```ts
export const Entity = namespace.createEntity(() => ({}));
export type Entity = DDataStructure.StructureValue<typeof Entity>;
```

**Limite connue :** la shape `{}` est seulement un squelette et ne peut pas être devinée à partir de tous les NewTypes du namespace. L'auto-fix souhaité est documenté ici, mais il faut tester sa validité et choisir entre correction automatique et suggestion explicite si la génération risque de masquer un modèle incomplet. Vérifier également la présence/l'ajout sûr de l'import `DDataStructure`.

Les corrections doivent être idempotentes, éviter les doublons et préserver les déclarations, commentaires et exports existants.

## 3. Règles explicitement écartées

- ~~`domain/require-fact-application`~~ : **ne pas ajouter**. Ne pas imposer l'appel à `applyFact` sur tous les chemins de réussite.
- ~~`domain/no-unauthorized-evidence-result`~~ : **ne pas ajouter**. La production ou l'utilisation d'une `Evidence` ne doit pas être restreinte à une couche. Les évidences peuvent être utilisées et établies côté technique, en particulier par les implementations de repositories/adaptateurs.

La liberté d'utiliser `Evidence` partout **n'annule pas** la règle contre les casts fabriquant artificiellement des preuves : celle-ci porte sur une fausse garantie, pas sur l'endroit de production.

## 4. Stratégie technique envisagée : Oxlint + ESLint ciblé

### Oxlint : premier passage, rapide

- Sur l'ensemble des sources pertinentes : règles génériques et règles de structure simples, imports, corrections automatiques.
- Privilégier les quatre règles de déclaration/auto-fix et les restrictions reconnaissables uniquement depuis l'AST.
- Les plugins JavaScript Oxlint exposent l'AST, les scopes et les fixes, **pas le TypeChecker TypeScript**. L'option `typeAware: true` de l'engine ne doit pas être interprétée comme un accès aux types depuis ces plugins.
- Reprendre les conventions du plugin existant : [`@duplojs/code-config/oxlint/plugin`](../scripts/oxlint/plugin).

### ESLint : second passage, ciblé et sémantique

- Exécuter uniquement les règles `domain/*` nécessitant une résolution de symboles/types, sur un périmètre restreint (ex. `src/business/domains/**/*.ts` et, pour les frontières, les fichiers des couches concernées).
- Utiliser le parser et le Project Service de `typescript-eslint`, sans activer toutes ses règles générales.
- Tenir compte du coût de création/chargement du projet TypeScript : réduire le nombre de fichiers visités **ne signifie pas** que seuls leurs types sont analysés.
- Conserver une option d'évolution vers le backend `tsgo` expérimental de `typescript-eslint` lorsqu'il sera utilisable pour ce projet ; ne pas la considérer comme une disponibilité garantie.
- Ne pas présumer qu'une future API de typage sera exposée aux plugins JS Oxlint. Si elle arrive, réévaluer la répartition au lieu de dupliquer les règles.

### Analyse commune souhaitable

Concevoir éventuellement un petit module de reconnaissance partagé :

1. Résoudre les imports, aliases, scopes et déclarations d'entités / flags / facts.
2. Relier chaque primitive à son namespace d'entité et, pour un fait, à sa cible.
3. Reconnaître les expressions directes, `.append(args)`, `.append(entity, args)`, les currifications, les références dans `pipe`, les alias et réexports.
4. Séparer **cas prouvés**, **cas interdits prouvés** et **cas indéterminés** ; ne pas bloquer les cas indéterminés par heuristique de nommage.

Mutualiser les parcours AST si cela apporte un gain, sans forcer une abstraction commune entre les interfaces de plugins si elle coûte plus qu'elle ne simplifie.

## 5. Tests de conception à prévoir

- Autorisé : `Task.refineState` appose un flag de `Task` ; une `Fact` de `Task` appose un flag de `Task`.
- Refusé : un use case/aggregate appose un flag ; une qualification de `Task` appose un flag de `List`.
- Autorisé/refusé de manière identique : appels directs, curifiés, fonctions dans `pipe`, références importées avec alias.
- Ne pas confondre une méthode utilisateur homonyme avec `Flag.append` ou `Entity.update`.
- Une `Fact` lit plusieurs entités mais ne modifie que sa cible.
- Un refinement synchrone de contexte peut combiner les qualifications et les évidences, mais ne provoque pas de transition ou d'effet.
- Un adaptateur peut produire une `Evidence` authentique : aucune erreur liée à la couche.
- Génération de `Entity` / des types : déclarations déjà présentes, `type` avant valeur, `interface` existante, exports partiels, import `DDataStructure` absent, seconde exécution de l'auto-fix (idempotence).
- Navigation correcte entre fichiers et re-exports ; pas de faux positif si une provenance est indéterminée.
- Exceptions assumées pour tests/fixtures et cas de construction `Entity.new` après validation.

## 6. Ordre de réalisation proposé

1. **Oxlint / auto-fix** : reconnaissance des namespaces d'entités, exports et types manquants, avec tests d'idempotence.
2. **ESLint / restrictions ciblées** : `Flag.append`, `Entity.update`, `Fact.run` et propriété des flags/facts, y compris currification.
3. **ESLint / garanties avancées** : assertions de preuves, mutations, pureté partielle des refinements, architecture des couches.
4. **Recherche** : suivi de l'entité obsolète dans les transitions ; définir un sous-ensemble démontrable avant toute activation.

**Cette proposition n'ajoute aucune règle exécutable à ce stade** : elle sert de référence avant une implémentation par lots et doit évoluer avec les décisions prises sur les exceptions et les faux positifs.
