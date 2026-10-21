# Recherche et version cible

## Résoudre avant d'écrire

1. Vérifier `docs/.vitepress/navigation/versions.ts`, les routes existantes et la version demandée. Résoudre la majeure documentaire `vN` depuis ce contexte ; la présence initiale de `fr/v1` n'en fait pas une cible permanente.
2. Lire `docs/package.json`, `docs/tsconfig.app.json` et le manifeste `docs/libs/<version>/<package>/package.json`. Identifier l'alias privé de cette majeure et sa résolution réelle, sans substituer le package courant. Les workspaces `@duplojs-v1/*` correspondent à `v1` ; une autre majeure utilise ses propres instantanés et alias déclarés.
3. Vérifier la résolution effective depuis `docs/`. Exemple de contrôle pour un alias `v1` installé, à adapter au contexte résolu :

   ```sh
   node --conditions=types --input-type=module -e 'console.log(import.meta.resolve("@duplojs-v1/lang/array"))'
   ```

   Les instantanés exposent des déclarations sans JavaScript exécutable : la condition `types` permet ici de résoudre le chemin, sans importer ni exécuter le `.d.ts`. Confirmer aussi la résolution TypeScript de l'exemple. Si elle échoue, examiner le sous-export `types` du manifeste et le lien workspace installé avant de conclure que l'API est absente.
4. Suivre les `exports` du manifeste et les réexports des `.d.ts` jusqu'au symbole. Un fichier présent dans `dist` n'est pas nécessairement public. Suivre les alias et distinguer les exports de valeurs des seuls exports de types ; une classe, une constante ou une méthode n'est pas automatiquement une fonction libre.
5. Retrouver les sources correspondantes dans `packages/<package>/package.json` et `scripts/`. Pour un chemin de source fourni par l'utilisateur, retrouver son export public dans la version cible avant de déterminer la route.

`DArray` n'identifie pas à lui seul un chemin disque. Le relier aux index publics ; les noms longs de namespace et les sous-exports sont vérifiés dans chaque package. Un sous-dossier interne ne crée pas automatiquement un niveau documentaire. Respecter les profondeurs déjà utilisées et l'organisation des exports. En cas de collision, qualifier la cible par package et namespace plutôt qu'écraser une page.

## Ce que représente une version documentaire

Les dossiers `docs/<langue>/vN/`, `docs/examples/vN/` et `docs/libs/vN/` se rapportent à la même **version majeure**. Ils ne créent pas une documentation distincte par release mineure ou corrective. Lorsque la dernière release documentée d'une majeure évolue, elle reste dans `vN` ; une nouvelle majeure dispose de son propre ensemble. Ne pas supposer que l'instantané présent est déjà à jour avec la dernière publication : son contenu résolu fait autorité pour cette génération.

Les packages privés sous `docs/libs/vN/` contiennent les déclarations de types nécessaires à la compilation et à l'affichage Twoslash, sans JavaScript à exécuter. La commande interne `snapshot:dist` prépare ces instantanés ; lire `docs/bin/snapshotDist/README.md` pour son fonctionnement si nécessaire. Le wrapper actuel cible `v1` : son existence n'autorise pas à l'exécuter pour actualiser une autre majeure ni à mélanger les versions. La maintenance des instantanés est distincte de la rédaction d'une page.

## Quelle source fait autorité ?

| Information | Preuve principale |
| --- | --- |
| Import, symbole et surcharges documentables | Exports et déclarations effectivement résolus pour la version cible |
| Comportement runtime | Tests et implémentation correspondant à cette version |
| Conventions de contribution | `AGENTS.md`, `.agents/`, consignes locales applicables |
| Concepts et usages | AgentKit, après contrôle de compatibilité avec la version cible |
| Présentation technique existante | Configuration VitePress, plugins, exemples ; pages API encore prototypes |

Les déclarations fixent le contrat TypeScript. Ne pas publier la signature d'implémentation `(...args) => any` d'une fonction surchargée comme une surcharge supplémentaire. Relever également les paramètres facultatifs, valeurs par défaut vérifiées, callbacks et leurs paramètres, synchronisme ou asynchronisme, erreurs et conditions limites pertinentes.

Les instantanés peuvent différer des sources courantes et d'AgentKit, notamment par leurs exports et surcharges. Vérifier chaque fonction employée dans l'exemple, y compris les opérations secondaires. Ne pas régénérer l'instantané pour contourner une absence. Si une fonction demandée manque dans la version cible, signaler précisément le conflit ; continuer les autres fonctions indépendantes.

Ne pas affirmer un détail runtime d'une ancienne version à partir d'une implémentation courante divergente. Chercher les sources versionnées disponibles ou rester au contrat vérifié. Une divergence qui change le sens de la page est bloquante pour cette page.

## Lire AgentKit avant de concevoir la page

Les liens des routeurs sont relatifs à leur propre fichier. Résoudre leurs destinations, sans reconstruire un nom de dossier à partir d'un namespace.

1. **Référence API** : `packages/agents-kit/docs/API.llms.md` → routeur de package/namespace → entrée exacte de fonction → fichier `.ts` lié. Lire cette référence lorsqu'elle existe, y compris les commentaires et assertions de types : ils expliquent les usages et les garanties à rendre visibles au lecteur. S'en servir comme base technique, sans reprendre les imports non versionnés ni les assertions destinées aux agents dans le code humain.
2. **Concepts** : depuis `packages/agents-kit/docs/concepts.llms.md`, sélectionner les notions nécessaires pour comprendre ces usages, leurs conditions et leurs limites. Ne pas relire tous les fondamentaux pour chaque fonction.
3. **Référence absente ou incomplète** : rechercher dans les sources `docs/API/` et leurs `index.md` si le routeur manque. Pour les informations réellement absentes, construire l'explication à partir des déclarations cibles, puis des tests ou implémentations compatibles. Ne pas inventer un comportement ni bloquer une page au seul motif qu'AgentKit ne la couvre pas encore.

Adapter les usages vérifiés de la référence à la page demandée. Les commentaires et assertions peuvent devenir une observation Twoslash ou une explication courte ; ils ne sont pas du texte à recopier. Chercher un complément seulement pour une capacité encore non couverte. Vérifier ensuite les fonctions employées et leurs garanties dans la majeure cible. Les points d'entrée ci-dessous facilitent les lectures conceptuelles nécessaires, sans fixer de couples de fonctions.

| Condition rencontrée | Ressources à lire depuis `packages/agents-kit/` |
| --- | --- |
| Forme curifiée, pipe, inférence contextuelle, async | `skills/fundamental/references/composition.md` et exemple utile ; concepts `01-fundamental/02-currying/` |
| Contraintes acquises, conservées, transformées ou perdues | `skills/fundamental/references/constraints-and-validation.md` ; concepts `01-fundamental/01-constraint/` |
| Either, extraction, propagation, exceptions ou OrThrow | `skills/fundamental/references/results-and-errors.md` ; concepts `01-fundamental/03-either/` |
| Schéma de validation, codec, erreurs structurées | Concepts `01-fundamental/04-data-structure/`, puis références de contraintes/résultats si concernées |

Consulter aussi `packages/agents-kit/skills/fundamental/SKILL.md` une fois quand des exemples DuploJS sont rédigés. Lire `.agents/curried-functions.md` pour la composition locale. Ces ressources orientent l'usage ; elles n'ajoutent aucune surcharge au contrat cible.

## Relevé minimal par fonction

Conserver temporairement : identifiant public, fichiers de preuve, destination Markdown/exemples, liste des surcharges, différences observables, garanties et limites, exemple prévu et liens existants pertinents. Noter toute simplification prévue avec le calcul exact qu'elle remplace. Ce relevé aide la rédaction et la vérification ; il ne fait pas partie de la page publique.
