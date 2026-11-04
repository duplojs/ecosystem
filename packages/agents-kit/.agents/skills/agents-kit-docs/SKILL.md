---
name: agents-kit-docs
description: "Créer, organiser ou corriger la documentation DuploJS dans AgentKit : contenu destiné aux agents, exposition dans les résumés LLM et sommaires vers ces résumés."
---

# Documentation AgentKit

Le package `@duplojs/agents-kit` regroupe les skills et la documentation destinés aux agents. Ce skill guide la rédaction et l'organisation de sa documentation.

Les chemins indiqués ci-dessous sont relatifs à la racine du package, accessible par [`../../..`](../../..) depuis le dossier de ce skill. La racine du monorepo se trouve deux niveaux au-dessus du package.

La documentation d'AgentKit fournit aux agents les connaissances nécessaires pour utiliser et implémenter les concepts de l'écosystème DuploJS. Les sources documentaires font autorité : les modifier, puis régénérer les fichiers `*.llms.md` concernés.

## Organiser la lecture par niveaux

Le **routage** permet de trouver la connaissance pertinente. Le **contenu documentaire** permet d'agir correctement une fois la ressource consultée. Deux types de fichiers `*.llms.md` organisent cette lecture :

| Type | Commande | Rôle |
| --- | --- | --- |
| Résumé documentaire | `generate-summary` | Exposer les introductions et les ressources d'un périmètre selon leur niveau d'exposition, avec des liens vers les détails. |
| Sommaire de résumés | `generate-table-of-content` | Présenter les domaines et pointer vers leurs résumés LLM pour choisir lequel charger. |

Lorsque le volume documentaire rend un résumé unique trop chargé, répartir les sources en périmètres cohérents, générer un résumé par périmètre et les rendre accessibles depuis un sommaire. L'agent consulte alors le sommaire, le résumé pertinent, puis les sources nécessaires. Ce parcours évite de charger l'inventaire de toute la documentation pour trouver une ressource.

Par exemple, `docs/concepts/` alimente directement le résumé `docs/concepts.llms.md`. La référence API utilise le sommaire `docs/API.llms.md`, qui mène aux résumés `index.llms.md` de ses domaines, puis aux fichiers TypeScript des fonctions. Choisir les périmètres et les niveaux de routage selon la documentation à exposer.

Pour documenter les fonctions dans `docs/API/`, appliquer les [précisions propres à la référence API](references/api.md) en complément des règles communes ci-dessous.

## Préparer l'intervention

- Définir la connaissance que la ressource doit transmettre et les décisions qu'elle doit permettre à l'agent de prendre. Respecter le périmètre demandé.
- Lire systématiquement le [skill fondamental](../../../skills/fundamental/SKILL.md) avant toute rédaction ou modification de documentation pour comprendre les principes et les usages communs de DuploJS et les appliquer aux explications et aux exemples.
- Selon le domaine documenté, consulter les autres [skills distribués dans `skills/`](../../../skills/) et les références pertinentes qu'ils indiquent pour comprendre comment utiliser les API et composer les mécanismes de l'écosystème. S'appuyer sur ces démarches pour présenter des usages cohérents, puis confirmer les contrats dans les sources documentaires et les API publiques concernées.
- Identifier le dossier source, son résumé et le sommaire qui y mène lorsqu'il existe, à partir des commandes de génération dans [`.commands/build.sh`](../../../.commands/build.sh). Déterminer à quel niveau exposer la ressource pour qu'un agent puisse la trouver sans charger les autres domaines.
- Consulter les documents voisins et les ressources consacrées aux notions mobilisées. Pour une révision, lire la ressource entière et les documents liés avant de choisir où intervenir. Identifier leur progression et la ressource responsable de chaque connaissance ; réutiliser leur terminologie et leurs références.
- Vérifier les exports publics et les signatures TypeScript utiles ; lire les implémentations et les tests lorsque le comportement ou les garanties nécessitent confirmation.
- Avant de créer ou modifier un exemple TypeScript, lire les [règles d'importation du monorepo](../../../../../.agents/importations.md), situées dans `../../.agents/importations.md` depuis la racine du package.

## Organiser les sources d'un résumé

Le parcours de `generate-summary` commence dans le dossier source passé à `--input` et descend récursivement dans les dossiers à préfixe numérique. Il reconnaît les fichiers documentaires numérotés et les `index.md`. L'ordre est lexical. Les conventions suivantes concernent les sources d'un résumé, dont `docs/concepts/`.

| Ressource | Convention |
| --- | --- |
| Dossier parcouru | Préfixe ordinal sur deux chiffres : `01-constraint/`, `02-currying/`, etc. |
| Fichier documentaire | Préfixe sur deux chiffres, selon le niveau d'exposition ci-dessous. Même convention pour Markdown et TypeScript. |
| `index.md` | Présentation courte du domaine correspondant au dossier. |
| Ressource auxiliaire | Fichier ou dossier sans préfixe numérique, comme `fixtures/` ; non parcouru, sauf `index.md`. Peut être référencé ou importé par les documents. |

Choisir le niveau d'exposition avant de numéroter un nouveau fichier :

| Format | Préfixes disponibles | Contenu intégré au résumé concerné |
| --- | --- | --- |
| TypeScript fondamental | `01` à `09` | Header et contenu documentaire. |
| TypeScript consulté à la demande | `10, 20, 30, 40, 50, 60, 70, 80, 90` | Header uniquement. |
| Markdown, y compris `index.md` | `01` à `09` ou les dizaines ci-dessus ; `index.md` sans préfixe | Partie précédant le premier séparateur `---`, ou fichier entier sans séparateur. |

Les fichiers détaillés utilisent exclusivement les dizaines indiquées : les positions intermédiaires comme `15` ou `25` sont exclues. Le préfixe ordonne les ressources dans leur niveau ; il ne change pas la règle d'exposition du Markdown.

Le séparateur Markdown est une ligne contenant exactement `---` ; il n'est pas exposé. La partie suivante reste dans le fichier source et se consulte à la demande. Un Markdown sans séparateur doit donc contenir uniquement du routage.

## Relier les résumés par un sommaire

`generate-table-of-content` parcourt récursivement le dossier passé à `--input`, y compris les dossiers sans préfixe numérique. Il construit le sommaire à partir des introductions des `index.md`, avant le premier séparateur `---`, et repère les fichiers `llms.md` ou `*.llms.md` présents dans les mêmes dossiers. Il transforme les titres de chaque introduction en liens vers le premier fichier LLM rencontré dans son dossier, relativement au fichier de sortie.

Placer un `index.md` auprès de chaque résumé à rendre accessible dans le sommaire. Son titre et sa description doivent permettre de choisir le domaine ; conserver l'inventaire des ressources dans le résumé. Les index des dossiers parents présentent les regroupements : sans fichier LLM dans leur dossier, leurs titres restent sans lien. Un dossier sans index laisse parcourir ses enfants, mais un résumé sans index n'apporte aucune entrée locale au sommaire.

Le sommaire réutilise ces présentations sans incorporer le contenu des résumés. Rédiger les index pour qu'ils restent utiles aux deux niveaux où ils sont exposés, plutôt que maintenir manuellement un second catalogue dans le fichier généré.

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

Dans les fichiers TypeScript documentaires, le header initial est l'unique commentaire de bloc autorisé. Réserver la forme `/** … */` à ce header et utiliser exclusivement des commentaires de ligne `//` dans le reste du fichier, y compris pour une explication sur plusieurs lignes. Convertir tout autre commentaire `/* … */` ou `/** … */` en lignes `//`, en conservant son contenu.

Dans les sources conceptuelles, un symbole d'API peut nommer le concept lui-même. Les fonctions utilisées seulement pour l'illustrer restent dans l'exemple.

Pour vérifier le périmètre du routage : **si l'exemple change mais transmet la même connaissance, le titre et la description doivent rester pertinents.**

## Rédiger le contenu documentaire

Écrire pour un agent qui peut consulter le reste de la documentation d'AgentKit. Donner les règles et les informations nécessaires pour utiliser ou implémenter le sujet correctement. Adapter la longueur et la structure à sa complexité ; un concept simple appelle une explication courte.

- **Sélectionner les détails utiles.** Ajouter une précision lorsqu'elle change une décision d'implémentation ou évite une erreur probable : contrat d'entrée ou de sortie, comportement runtime, garantie de typage, précondition ou limite pertinente. Ne pas transformer les possibilités d'explication en liste de sujets à couvrir systématiquement.
- **Intégrer les changements dans l'explication.** Reprendre le passage responsable du concept pour y intégrer la précision demandée : fusionner, déplacer, remplacer ou supprimer ce qui devient redondant. Préserver la progression du document plutôt qu'ajouter une note ou une exception à chaque demande. Limiter le remaniement aux parties nécessaires à cette cohérence.
- **Donner une place unique à chaque connaissance.** Énoncer une règle une fois, dans la ressource responsable du concept. Référencer les fondamentaux et documents complémentaires plutôt que réexpliquer leurs mécanismes.
- **Démontrer la connaissance par les exemples.** Choisir le plus petit exemple représentatif, avec du code vérifié par TypeScript et conforme aux conventions. Réutiliser les fixtures pertinentes ; ajouter un autre exemple seulement s'il apporte un comportement ou une garantie distincte.
- **Rendre les résultats mis en avant lisibles et vérifiables.** Dans les concepts comme dans les autres exemples documentaires, lorsqu'un résultat de fonction, de traitement ou un affinement de type aide à comprendre la connaissance illustrée, montrer son type avec `DCommon.ExpectType<typeof result, TypeAttendu, "strict">`, au plus près de l'expression concernée. Dans une branche ou une callback, placer la vérification là où l'affinement est disponible. Écrire le type attendu explicitement pour rendre immédiatement visibles ses variantes et garanties ; un commentaire de type seul ne remplit pas cette obligation. Laisser le résultat s'inférer, sans annotation ni assertion qui imposerait le type attendu. Si la comparaison échoue, corriger l'exemple ou le type attendu pour refléter l'inférence réelle ; ne pas assouplir le mode `"strict"`. Sélectionner les résultats utiles à l'explication, sans vérifier systématiquement chaque variable intermédiaire.
- **Préserver l'inférence dans les appels.** Écrire les objets qui configurent une opération, comme les matchers et les sélecteurs, directement dans les arguments de la fonction qui les reçoit. Leur structure et leurs callbacks doivent bénéficier du contexte d'inférence de cet appel. Ne pas les extraire dans des variables ou des helpers pour les réutiliser entre exemples ; répéter la configuration nécessaire dans chaque appel. Ne pas compenser cette extraction par des annotations, des génériques explicites ou des assertions.
- **Construire les exemples avec les API DuploJS.** Pour chaque opération de l'exemple, rechercher d'abord la fonction publique correspondante dans les concepts et la référence API existante, puis l'utiliser dès qu'elle existe. Cette obligation couvre aussi la préparation des données, les callbacks et les étapes de pipe, même pour une transformation triviale. Une méthode native de prototype, un utilitaire tiers ou une réimplémentation locale ne doit pas remplacer l'équivalent DuploJS. La simplicité ou la brièveté d'un appel natif ne justifie pas son utilisation.
- **Passer directement les fonctions unaires.** Lorsqu'une fonction de l'API reçoit un seul argument et correspond au traitement attendu, la passer directement comme callback ou comme étape de pipe. Ne pas l'envelopper dans une callback qui ne fait que lui transmettre son argument. Une fonction déjà unaire est directement utilisable dans un pipe, sans forme curifiée supplémentaire.
- **Commenter ce que le code seul ne dit pas.** Expliquer les conditions, les valeurs obtenues à l'exécution et le sens des garanties utiles au raisonnement de l'agent. Les commentaires complètent les vérifications de type sans les remplacer. Éviter la paraphrase du code et les rappels généraux de TypeScript.

Le Markdown porte les explications et contextualise les liens vers les exemples TypeScript ou les fixtures, sans recopier leur implémentation. Les fichiers TypeScript documentaires associent code et commentaires après leur header ; plusieurs API peuvent être combinées pour démontrer un même concept.

## Intégrer et générer

Placer la ressource dans le domaine approprié selon les conventions d'organisation et d'exposition. Adapter l'index si le périmètre du domaine évolue.

La CLI locale `pnpm run llms`, définie dans [`bin/index.ts`](../../../bin/index.ts), fournit les deux commandes de génération. Depuis la racine du package, générer les résumés concernés avant le sommaire qui les référence :

```sh
pnpm run llms generate-summary --input <dossier-source> --output <résumé>.llms.md --ignore '*.llms.md'
pnpm run llms generate-table-of-content --input <dossier-des-domaines> --output <sommaire>.llms.md
```

Les deux commandes exigent `--input` et une sortie `--output` terminant par `.llms.md`. L'option `--ignore` exclut les chemins correspondant au motif ; entourer les motifs de quotes pour éviter leur expansion par le shell. Pour un résumé écrit parmi ses sources, exclure les fichiers LLM déjà générés. Le sommaire doit au contraire pouvoir les repérer ; il exclut automatiquement son propre fichier de sortie.

Le build `pnpm --filter @duplojs/agents-kit build` génère `docs/concepts.llms.md`, puis les `index.llms.md` des domaines API configurés, puis le sommaire `docs/API.llms.md`. Lors de l'ajout d'un périmètre documentaire, intégrer sa génération dans `.commands/build.sh` en conservant cet ordre de dépendance.

Les commandes `test:types` (via `tsconfig.doc.json`) et `test:lint` du package vérifient aussi les exemples et les fixtures. Vérifier que les nouveaux dossiers documentaires sont couverts par ces configurations. Le champ `files` du package doit inclure `docs` afin de publier ensemble les routeurs et leurs cibles ; adapter les fichiers publiés si les sources ou les routeurs sont placés ailleurs.

## Vérifier le parcours et le contenu

- Vérifier la position, l'ordre, la numérotation et l'exposition selon les tableaux ci-dessus.
- Relire le routage indépendamment des exemples : il doit permettre de retrouver le sujet sans charger son explication.
- Après génération, vérifier le résumé concerné : présentation du domaine, exposition attendue des ressources et liens résolus relativement au fichier qui les contient.
- Lorsqu'un sommaire mène à ce résumé, vérifier aussi l'entrée du domaine, son lien et la pertinence de sa présentation. Parcourir un chemin complet du sommaire à une source pour contrôler que chaque niveau permet de choisir la suite sans répéter le détail du suivant.
- Relire chaque ressource modifiée dans son ensemble, du point de vue d'une future implémentation : progression homogène, absence de contradiction ou de répétition, longueur proportionnée aux décisions et garanties à transmettre. Retirer les passages sans apport et remplacer les réexplications par les références pertinentes.
- Vérifier les liens, l'exactitude des API et, pour les exemples TypeScript créés ou modifiés, la conformité des imports et le typage.
- Inspecter chaque appel dans les exemples, y compris à l'intérieur des callbacks. Pour tout appel natif ou tiers, rechercher l'équivalent public DuploJS et le remplacer lorsqu'il existe. Effectuer ce contrôle même si le typage et le lint passent.
