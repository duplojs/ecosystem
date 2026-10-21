# Validation

## Préparer les commandes

Depuis la racine du monorepo, vérifier les scripts du workspace `docs` avant de les lancer. Commandes constatées :

```sh
pnpm --filter docs test:types
pnpm --filter docs exec vue-tsc -p tsconfig.app.json --noEmit
pnpm --filter docs exec vue-tsc -p tsconfig.config.json --noEmit
pnpm --filter docs test:lint
pnpm --filter docs build
```

Les commandes `pnpm --filter docs` s'exécutent avec `docs/` comme répertoire de travail. Ne pas invoquer les scripts Bash depuis un autre dossier avec des chemins relatifs incorrects. Il n'existe pas actuellement de script `docs test:types:target` : ne pas reprendre automatiquement les commandes des autres packages.

Les outils de qualité consomment les `dist` des packages de configuration ; ils doivent être disponibles et à jour. Respecter l'ordre de validation décrit par `.agents/commands.md` pour une modification de ces packages. Une génération documentaire contre un instantané ne demande pas de reconstruire tous les packages ni de lancer leurs tests unitaires.

**Ne pas se satisfaire du seul `test:types`.** Il appelle actuellement `vue-tsc -p tsconfig.json`, alors que ce fichier n'a aucune entrée et ne contient que des références de projets. Sans mode build, ce lancement ne suffit pas à établir la vérification des exemples du projet référencé. Appeler aussi explicitement `tsconfig.app.json` ; `tsconfig.config.json` couvre les configurations racine. Ne pas modifier la configuration pour faire passer la validation.

Le lint transmet ses arguments aux deux outils Oxlint et ESLint. Le lancer une fois pour le lot ; pour un contrôle ciblé, vérifier que le chemin transmis est accepté par les deux. Une réussite du lint ne contrôle pas le Markdown ni les contrats des signatures.

Les lignes vides réservées aux fenêtres Twoslash font partie de la mise en page des exemples. Si le lint les refuse, relever la règle exacte au lieu de comprimer le code et de masquer les lignes utiles. Un ajustement de configuration, lorsqu'il fait partie de la tâche, doit rester limité aux exemples documentaires ; ne pas assouplir les règles de tous les packages.

## Relecture de cohérence de la page entière

Après rédaction et intégration, relire la page dans l'ordre avec le contenu de ses fichiers inclus, en prenant le point de vue d'un développeur qui découvre la fonction. Porter un jugement sur ce qu'il peut comprendre, pas seulement sur la présence des sections :

- Peut-il identifier le besoin couvert, les arguments acceptés, les formes disponibles et les résultats sans suivre des détails internes de vérification de types ? Les signatures et les explications des paramètres se correspondent-elles ?
- Les mini-usages montrent-ils les capacités importantes et les différences d'inférence utiles, avec une forme d'appel adaptée ? Le pipe raconte-t-il un petit workflow compréhensible, ou ne fait-il que répéter un appel isolé ? Les observations Twoslash éclairent-elles des points choisis sans surcharger la lecture ?
- Chaque comparaison montre-t-elle une référence et une variation observables ? Les données et les types permettent-ils d'attribuer la différence au facteur expliqué ? Un complément suppose-t-il un résultat ou une notion jamais montrés auparavant ?
- Les exemples, signatures, paramètres et retours racontent-ils le même contrat, dans un ordre lisible, sans redondance ni détour vers une autre API ? Chaque section ou complément apporte-t-il une information utile ?

Corriger les manques ou incohérences repérés avant de terminer, puis vérifier les éléments affectés. La compilation ne valide ni la pertinence d'un exemple ni cette cohérence pédagogique. Cette relecture est un travail interne, pas une nouvelle section de la page ou un rapport à produire systématiquement.

## Vérification des exemples

1. Vérifier que la référence API AgentKit a été lue lorsqu'elle existe, que ses usages ont été confrontés à la majeure cible et que l'exemple illustre bien la capacité annoncée de la fonction documentée. Lorsqu'un pipe montre l'usage curifié, vérifier que la cible figure dans un enchaînement utile, sans étapes ajoutées pour faire nombre. Rechercher les API équivalentes aux callbacks manuelles et retirer les traitements secondaires qui détournent la démonstration.
2. Compiler les vrais fichiers inclus dans les pages avec le projet des exemples. Vérifier que leur dossier, leurs imports et les déclarations résolues appartiennent à la même majeure. Contrôler les types réels des entrées et résultats : un cas annoncé comme primitif général ne doit pas être resté littéral. Inspecter les requêtes `^?` retenues et les comparer aux garanties annoncées, y compris après une référence au résultat d'un pipe. Ne pas forcer les résultats ni afficher les assertions de travail d'AgentKit.
3. Contrôler chaque erreur intentionnelle : `@ts-expect-error` dans le `.ts`, code exact dans `@errors` du bloc Markdown, diagnostic affiché après retrait de la directive par le pipeline. Aucun mécanisme désactivant la validation des erreurs.
4. Contrôler indépendamment les valeurs runtime décrites à partir des tests et sources compatibles ; la compilation et Twoslash n'exécutent pas ces exemples. Pour une API de plateforme, distinguer exemple typable, environnement requis et exécution réellement vérifiée.
5. Construire la documentation pour tester l'inclusion, les imports dans Twoslash, les diagnostics et le rendu. Sans `twoslash` dans l'en-tête du bloc, `explicitTrigger: true` laisse le code sans cette analyse. Ouvrir les fenêtres de types/diagnostics : partir d'environ quatre lignes vides après une requête suivie de code, puis ajuster à la hauteur réelle pour préserver la lecture. Ne pas appliquer cette marge automatiquement à la dernière requête d'un extrait sans code en dessous. Un build réussi ne prouve pas l'absence de recouvrement visuel.

## Build, cache et coût des lots

`docs/.commands/build.sh` supprime le cache Twoslash hors CI avant le build. Ne pas lancer cette commande après chaque page. Après le typecheck du lot, construire une fois et examiner les artefacts générés. Ne jamais utiliser `CI=1` comme raccourci : en CI, `twoslashCache.ts` exige que le cache ait déjà été calculé.

Le cache est indexé par le contenu de tous les exemples et instantanés, pas uniquement par celui de la page. Un exemple ajouté invalide donc les clés précédentes. Un build local peut renouveler de nombreux fichiers de `docs/.vitepress/cache/twoslash/`, volontairement suivis par Git. Examiner et livrer ces changements lorsqu'ils sont nécessaires aux pages produites ; ne pas conserver d'artefacts de test isolé. Ne pas régénérer `docs/libs/` via `snapshot:dist` dans cette tâche.

En cas d'échec : distinguer une erreur de la page d'un problème préalable de dépendances/configuration. Corriger les fichiers documentaires responsables. Si le problème est extérieur au périmètre, indiquer la commande et l'erreur exacte ; ne pas modifier une configuration globale ou une API pour masquer l'échec. Poursuivre les contrôles indépendants encore utiles.

## Liens, contrats et intégration

Le build VitePress détecte les liens Markdown internes cassés, mais ne constitue pas une preuve de validité de tous les liens du frontmatter ou des ancres. Pour chaque page et voisin modifié :

- Résoudre les chemins des inclusions et tous les liens ajoutés/modifiés. Pour une route `/fr/v1/api/lang/array/map`, chercher `docs/fr/v1/api/lang/array/map.md` ; pour `/fr/v1/api/lang/array/`, chercher son `index.md`. Vérifier aussi les ancres sur les titres réellement rendus.
- Vérifier l'organisation des exemples : un fichier `<fonction>.ts` seul, ou un dossier `<fonction>/` contenant `index.ts` et les compléments. Après un déplacement, contrôler toutes les inclusions concernées et l'absence d'ancien fichier ou de fichier frère portant un suffixe.
- Contrôler explicitement `prev.link` et `next.link`, la réciprocité entre fonctions et l'ordre du sommaire aplati. Vérifier que la première revient à l'index en `prev` et la dernière en `next`, y compris entre groupes ; pour une page seule, les deux liens reviennent à l'index. Ne pas assimiler un build réussi à ce contrôle.
- Vérifier l'accès depuis l'index global au package, puis au namespace et à la fonction ; absence de doublon et de lien vers une page future.
- Comparer chaque famille de signatures aux déclarations cibles : portée des génériques, paramètres, type predicates, retours et garanties. Les blocs de Syntaxe ne sont pas compilés par Twoslash.
- Vérifier la présentation de Syntaxe : un titre et un bloc par forme, aucune déclaration d'import ni préparation, génériques et paramètres multilignes indentés, callbacks développées, noms descriptifs conservés. Séparer les structures auxiliaires utiles ; reporter les conditions des utilitaires de vérification dans les paramètres concernés. Retirer les phrases qui redéfinissent les deux formes ou répètent sans apport qu'une fonction entre dans un pipe.
- Vérifier la lisibilité en diagonale : idées distinctes séparées, garanties listées lorsque cela facilite la comparaison, quelques mots-clés en gras et identifiants en code. Les types de retour opaques cités dans les signatures doivent avoir une définition ou une explication suffisante pour relier leur structure aux garanties annoncées.
- Vérifier titre, description autonome, outline et classe du thème des pages et des index créés ou modifiés, sections requises et absence de sections vides ; lire le rendu d'au moins un exemple complexe ou d'une nouvelle technique Twoslash.
- Examiner les « Voir aussi » de la nouvelle page et des pages directement associées déjà présentes ; vérifier la pertinence des liens inverses ajoutés et l'absence de doublon. Ne pas exiger de réciprocité sans intérêt pour le lecteur.
- Ouvrir les sources externes ajoutées et confirmer qu'elles soutiennent le propos ; si elles ne sont pas vérifiables, ne pas les publier comme référence validée.

## Fin de lot

Examiner `git diff --check`, `git diff --stat` et les fichiers non suivis. Confirmer que seuls les pages ciblées, exemples, index, voisins nécessaires, « Voir aussi » directement concernés et caches justifiés ont changé. Ne pas annuler les changements préexistants de l'utilisateur.

Rapporter brièvement : pages et exemples produits, intégration réalisée, commandes réellement exécutées et résultats, éventuels échecs préexistants ou pages bloquées. Une vérification non exécutée ou seulement partielle doit être nommée comme telle. Ne pas annoncer l'objectif de 90 % comme un taux mesuré.
