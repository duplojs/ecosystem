---
name: agents-kit-docs
description: "Créer, organiser ou corriger la documentation DuploJS dans le package AgentKit : documentation concise pour les agents, routage et exposition dans les fichiers générés `*.llms.md`."
---

# Documentation AgentKit

Le package `@duplojs/agents-kit` regroupe les skills et la documentation destinés aux agents. Ce skill guide la rédaction et l'organisation de sa documentation.

Les chemins indiqués ci-dessous sont relatifs à la racine du package, accessible par [`../../..`](../../..) depuis le dossier de ce skill. La racine du monorepo se trouve deux niveaux au-dessus du package.

La documentation d'AgentKit fournit aux agents les connaissances nécessaires pour utiliser et implémenter les concepts de l'écosystème DuploJS. Toutes ses sources documentaires doivent être pensées pour alimenter des fichiers `*.llms.md`. Chacun de ces fichiers sert de routeur vers les ressources de son périmètre et suit les mêmes règles de rédaction, d'organisation et d'exposition. Par exemple, `docs/concepts/` alimente `docs/concepts.llms.md` ; d'autres ensembles documentaires peuvent alimenter leurs propres routeurs. Les sources documentaires font autorité : les modifier, puis régénérer les routeurs concernés.

Le **routage** permet de trouver la connaissance pertinente. Le **contenu documentaire** permet d'agir correctement une fois la ressource consultée. Organiser les deux pour limiter le contexte chargé et les répétitions.

Pour documenter les fonctions dans `docs/API/`, appliquer les [précisions propres à la référence API](references/api.md) en complément des règles communes ci-dessous.

## Préparer l'intervention

- Définir la connaissance que la ressource doit transmettre et les décisions qu'elle doit permettre à l'agent de prendre. Respecter le périmètre demandé.
- Lire systématiquement le [skill fondamental](../../../skills/fundamental/SKILL.md) avant toute rédaction ou modification de documentation pour comprendre les principes et les usages communs de DuploJS et les appliquer aux explications et aux exemples.
- Selon le domaine documenté, consulter les autres [skills distribués dans `skills/`](../../../skills/) et les références pertinentes qu'ils indiquent pour comprendre comment utiliser les API et composer les mécanismes de l'écosystème. S'appuyer sur ces démarches pour présenter des usages cohérents, puis confirmer les contrats dans les sources documentaires et les API publiques concernées.
- Identifier le dossier source et les routeurs `*.llms.md` concernés à partir des commandes de génération du package. Appliquer les mêmes règles à chaque ensemble documentaire.
- Consulter les documents voisins et les ressources consacrées aux notions mobilisées. Pour une révision, lire la ressource entière et les documents liés avant de choisir où intervenir. Identifier leur progression et la ressource responsable de chaque connaissance ; réutiliser leur terminologie et leurs références.
- Vérifier les exports publics et les signatures TypeScript utiles ; lire les implémentations et les tests lorsque le comportement ou les garanties nécessitent confirmation.
- Avant de créer ou modifier un exemple TypeScript, lire les [règles d'importation du monorepo](../../../../../.agents/importations.md), situées dans `../../.agents/importations.md` depuis la racine du package.

## Organisation et exposition

Pour chaque routeur, le parcours de génération commence dans le dossier source passé à `generate-llms --input` et descend récursivement dans les dossiers à préfixe numérique. Il reconnaît les fichiers documentaires numérotés et les `index.md`. L'ordre est lexical. Ces conventions s'appliquent à tous les dossiers sources, dont `docs/concepts/`.

| Ressource | Convention |
| --- | --- |
| Dossier parcouru | Préfixe ordinal sur deux chiffres : `01-constraint/`, `02-currying/`, etc. |
| Fichier documentaire | Préfixe sur deux chiffres, selon le niveau d'exposition ci-dessous. Même convention pour Markdown et TypeScript. |
| `index.md` | Présentation courte du domaine correspondant au dossier. |
| Ressource auxiliaire | Fichier ou dossier sans préfixe numérique, comme `fixtures/` ; non parcouru, sauf `index.md`. Peut être référencé ou importé par les documents. |

Choisir le niveau d'exposition avant de numéroter un nouveau fichier :

| Format | Préfixes disponibles | Contenu intégré à chaque routeur `*.llms.md` concerné |
| --- | --- | --- |
| TypeScript fondamental | `01` à `09` | Header et contenu documentaire. |
| TypeScript consulté à la demande | `10, 20, 30, 40, 50, 60, 70, 80, 90` | Header uniquement. |
| Markdown, y compris `index.md` | `01` à `09` ou les dizaines ci-dessus ; `index.md` sans préfixe | Partie précédant le premier séparateur `---`, ou fichier entier sans séparateur. |

Les fichiers détaillés utilisent exclusivement les dizaines indiquées : les positions intermédiaires comme `15` ou `25` sont exclues. Le préfixe ordonne les ressources dans leur niveau ; il ne change pas la règle d'exposition du Markdown.

Le séparateur Markdown est une ligne contenant exactement `---` ; il n'est pas exposé. La partie suivante reste dans le fichier source et se consulte à la demande. Un Markdown sans séparateur doit donc contenir uniquement du routage.

## Rédiger le routage

Nommer le concept, le problème ou la capacité documentée avec un titre explicite et une description succincte. Le routage identifie le sujet sans l'enseigner : les explications, comportements détaillés et exemples appartiennent au contenu documentaire.

- **Index :** caractériser le domaine à la granularité du dossier. Un index supérieur présente un domaine large ; les ressources suivantes précisent les concepts.
- **Markdown :** placer le titre et la description avant le séparateur.
- **TypeScript :** ouvrir chaque fichier parcouru avec un header de cette forme :

```ts
/**
 * @title Preuves de passage par une opération.
 *
 * Exiger dans les types qu'une valeur soit passée par un traitement préalable.
 */
```

Dans les sources conceptuelles, un symbole d'API peut nommer le concept lui-même. Les fonctions utilisées seulement pour l'illustrer restent dans l'exemple.

Pour vérifier le périmètre du routage : **si l'exemple change mais transmet la même connaissance, le titre et la description doivent rester pertinents.**

## Rédiger le contenu documentaire

Écrire pour un agent qui peut consulter le reste de la documentation d'AgentKit. Donner les règles et les informations nécessaires pour utiliser ou implémenter le sujet correctement. Adapter la longueur et la structure à sa complexité ; un concept simple appelle une explication courte.

- **Sélectionner les détails utiles.** Ajouter une précision lorsqu'elle change une décision d'implémentation ou évite une erreur probable : contrat d'entrée ou de sortie, comportement runtime, garantie de typage, précondition ou limite pertinente. Ne pas transformer les possibilités d'explication en liste de sujets à couvrir systématiquement.
- **Intégrer les changements dans l'explication.** Reprendre le passage responsable du concept pour y intégrer la précision demandée : fusionner, déplacer, remplacer ou supprimer ce qui devient redondant. Préserver la progression du document plutôt qu'ajouter une note ou une exception à chaque demande. Limiter le remaniement aux parties nécessaires à cette cohérence.
- **Donner une place unique à chaque connaissance.** Énoncer une règle une fois, dans la ressource responsable du concept. Référencer les fondamentaux et documents complémentaires plutôt que réexpliquer leurs mécanismes.
- **Utiliser les exemples comme preuves.** Choisir le plus petit exemple représentatif qui démontre la connaissance, avec du code typable et conforme aux conventions. Réutiliser les fixtures pertinentes ; ajouter un autre exemple seulement s'il apporte un comportement ou une garantie distincte.
- **Construire les exemples avec les API DuploJS.** Pour chaque opération de l'exemple, rechercher d'abord la fonction publique correspondante dans les concepts et la référence API existante, puis l'utiliser dès qu'elle existe. Cette obligation couvre aussi la préparation des données, les callbacks et les étapes de pipe, même pour une transformation triviale. Une méthode native de prototype, un utilitaire tiers ou une réimplémentation locale ne doit pas remplacer l'équivalent DuploJS. La simplicité ou la brièveté d'un appel natif ne justifie pas son utilisation.
- **Passer directement les fonctions unaires.** Lorsqu'une fonction de l'API reçoit un seul argument et correspond au traitement attendu, la passer directement comme callback ou comme étape de pipe. Ne pas l'envelopper dans une callback qui ne fait que lui transmettre son argument. Une fonction déjà unaire est directement utilisable dans un pipe, sans forme curifiée supplémentaire.
- **Commenter ce que le code seul ne dit pas.** Expliquer les conditions, les résultats ou le typage utiles au raisonnement de l'agent. Éviter la paraphrase du code et les rappels généraux de TypeScript.

Le Markdown porte les explications et contextualise les liens vers les exemples TypeScript ou les fixtures, sans recopier leur implémentation. Les fichiers TypeScript documentaires associent code et commentaires après leur header ; plusieurs API peuvent être combinées pour démontrer un même concept.

## Intégrer et vérifier

Placer la ressource dans le domaine approprié selon les conventions d'organisation et d'exposition. Adapter l'index si le périmètre du domaine évolue.

Le build `pnpm --filter @duplojs/agents-kit build` régénère les routeurs déclarés dans `.commands/build.sh`. Pour chaque routeur concerné, utiliser le dossier source et la sortie correspondants, depuis la racine du package :

```sh
pnpm run generate:llms --input <dossier-source> --output <nom>.llms.md
```

Les commandes `test:types` (via `tsconfig.doc.json`) et `test:lint` du package vérifient aussi les exemples et les fixtures. Vérifier que les nouveaux dossiers documentaires sont couverts par ces configurations. Le champ `files` du package doit inclure `docs` afin de publier ensemble les routeurs et leurs cibles ; adapter les fichiers publiés si les sources ou les routeurs sont placés ailleurs.

Avant de terminer :

- Vérifier la position, l'ordre, la numérotation et l'exposition selon les tableaux ci-dessus.
- Relire le routage indépendamment des exemples : il doit permettre de retrouver le sujet sans charger son explication.
- Vérifier chaque routeur concerné après génération : exposition attendue, pertinence du routage dans son périmètre et liens résolus relativement au fichier `*.llms.md` qui les contient.
- Relire chaque ressource modifiée dans son ensemble, du point de vue d'une future implémentation : progression homogène, absence de contradiction ou de répétition, longueur proportionnée aux décisions et garanties à transmettre. Retirer les passages sans apport et remplacer les réexplications par les références pertinentes.
- Vérifier les liens, l'exactitude des API et, pour les exemples TypeScript créés ou modifiés, la conformité des imports et le typage.
- Inspecter chaque appel dans les exemples, y compris à l'intérieur des callbacks. Pour tout appel natif ou tiers, rechercher l'équivalent public DuploJS et le remplacer lorsqu'il existe. Effectuer ce contrôle même si le typage et le lint passent.
