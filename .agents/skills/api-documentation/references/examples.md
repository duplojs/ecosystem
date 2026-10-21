# Exemples TypeScript et Twoslash

## Contrat de fichier et inclusion

Créer les exemples sous `docs/examples/<version>/api/<package>/<namespace éventuel>/`. Choisir l'organisation selon le nombre de fichiers nécessaires à la page, pas selon le nombre d'appels dans un extrait :

| Besoin | Organisation |
| --- | --- |
| Un seul fichier d'exemple | `<fonction>.ts`, contenant éventuellement plusieurs mini-usages |
| Plusieurs fichiers pour la même page | `<fonction>/index.ts` pour l'exemple principal et `<fonction>/<usage>.ts` pour chaque complément |

`index.ts` contient l'exemple principal, ce n'est pas un barrel de réexports. Lors de l'ajout d'un complément, déplacer le fichier principal dans ce dossier et actualiser toutes les inclusions concernées. Ne pas conserver en parallèle le fichier `<fonction>.ts` ni créer des fichiers frères `<fonction>.<usage>.ts`. Cette organisation ne justifie pas de déplacer les exemples d'autres pages.

La convention réelle est une inclusion complète, dans un bloc marqué explicitement :

````md
```ts twoslash
<!--@include: @/examples/v1/api/lang/array/map.ts-->
```
````

Adapter le chemin au contexte résolu. Le plugin `docs/.vitepress/plugins/markdownInclude.ts` remplace `@/` par la racine `docs/` et lit le fichier entier. Les autres chemins sont relatifs à la page Markdown. Il ne gère pas de sélection `#region` ni de plage de lignes : ne pas inventer ces suffixes. Pour plusieurs extraits, préférer plusieurs petits fichiers complets.

`docs/examples/v1/api/lang/array/map.ts` et sa page associée démontrent le mécanisme technique ; leur contenu ne fixe pas le modèle rédactionnel des futures pages.

## Imports et contexte

Les `.ts` utilisent les alias réellement déclarés pour la majeure documentaire résolue. Le chemin de l'exemple, les déclarations sous `docs/libs/<version>/` et les alias importés doivent appartenir à cette même majeure. Importer le sous-export public le plus précis sous son namespace long ; une déclaration d'import tient sur une ligne. Ne pas importer `@scripts`, les sources d'un package, un fichier `dist` interne, un ancien package disparu ou un package courant pour obtenir artificiellement une fonction absente de l'instantané.

Le plugin `publicPackageNames.ts` affiche les noms `@duplojs/*` à la place des alias `@duplojs-vN/*` dans le code rendu. Les fichiers vérifiés doivent néanmoins garder leurs imports versionnés. Les instantanés fournissent uniquement des `.d.ts` : compiler l'exemple ne démontre pas son résultat runtime et ne permet pas de l'exécuter avec cet alias.

Lire la configuration Twoslash actuelle dans `docs/.vitepress/config.ts`. Elle utilise notamment `strict`, `noUncheckedIndexedAccess` et `types: []`. Le projet des exemples inclut aussi des types de plateforme ; une réussite de son typecheck ne prouve donc pas la réussite de Twoslash. Les deux contrôles sont nécessaires.

## Adapter un usage pertinent au lecteur humain

Partir de la référence API AgentKit lue selon la [démarche de recherche](sources.md). Ses exemples et assertions renseignent les capacités à montrer ; adapter leur présentation, leurs imports et leurs observations au contexte documentaire. Si aucune référence ne couvre le besoin, construire le cas à partir du contrat vérifié et des concepts utiles.

- **Capacités visibles** : déterminer ce que le lecteur doit comprendre sur la cible : opération, formes d'appel, options, paramètres de callback, affinement ou contraintes. Choisir un ou plusieurs usages courts selon les différences utiles à montrer ; ne pas ajouter un traitement sans lien avec ces capacités.
- **Fonction au centre** : la cible doit accomplir l'opération que l'exemple prétend illustrer. Dans un pipe montrant son usage curifié, son appel doit figurer parmi les étapes ; traiter ensuite le résultat d'un appel direct dans un pipe ne démontre pas cette forme. Les opérations secondaires ne doivent pas devenir le sujet principal.
- **API existantes** : rechercher les fonctions compatibles de l'écosystème, notamment les prédicats, avant d'écrire une callback ou une règle équivalente à la main. Une callback explicite reste pertinente pour une logique propre au scénario ou pour expliquer son contrat, sans en faire le choix par défaut.
- **Composition utile** : lorsqu'un exemple emploie un pipe, montrer un mini-workflow dont on peut nommer le résultat : en général deux ou trois opérations utiles, parfois quatre, avec la cible à sa place dans le traitement. Un pipe réduit à la cible seule montre surtout une compatibilité déjà visible dans la signature ; privilégier alors un appel direct, sauf si cette forme minimale éclaire une difficulté précise d'inférence. Ne pas ajouter des étapes pour atteindre un quota ni laisser les fonctions secondaires prendre le dessus. Si plusieurs opérations transforment la même valeur dans une callback, rechercher la composition adaptée à ce contrat avant de multiplier les parcours ou les étapes extérieures.
- **Types observables** : laisser les résultats s'inférer. Les assertions de type d'AgentKit servent à comprendre la garantie ; les traduire en observations Twoslash ciblées, plutôt que montrer des `ExpectType` au lecteur. Un type d'entrée explicite ou `as const` peut établir le contexte sans fabriquer de garantie.
- **Garanties fondées** : une contrainte vient d'un prédicat, d'une validation ou d'une information statique compatible. Un `declare const` peut représenter un prérequis déjà établi, à condition de le préciser. N'annoncer une valeur runtime que sur la base de preuves compatibles ; Twoslash ne l'exécute pas.

## Couvrir les usages et construire les comparaisons

L'exemple principal n'est pas limité à un seul appel ou à un pipe. Réunir quelques mini-usages complémentaires selon les capacités importantes de la fonction, sans nombre fixe à atteindre ni plafond qui ferait omettre une différence utile. Une fonction simple peut n'en nécessiter qu'un ; éviter le catalogue de toutes les combinaisons. Choisir entre appels directs, options et mini-workflow selon ce qu'ils apprennent ; ne pas faire du pipe l'unique démonstration par défaut.

Lorsque l'inférence varie selon les informations d'entrée, montrer les contextes qui expliquent réellement cette différence : littéral connu, type primitif général ou valeur portant une contrainte déjà établie. Un `declare const` permet de représenter une donnée dont la valeur runtime est inconnue, y compris de type primitif ; il n'exécute ni ne valide rien. Ne pas limiter tous les exemples aux littéraux ni multiplier ces contextes lorsqu'ils donnent le même enseignement.

Vérifier le type effectif avant d'annoncer une comparaison : un littéral peut rester précis dans une constante ou être préservé par les génériques `const` d'une fonction de composition. Nommer la valeur ailleurs ne crée pas à lui seul un cas de type primitif général. Pour ce dernier, fournir un contexte réellement élargi, par exemple une entrée déclarée avec son type primitif, puis vérifier le résultat. Une annotation d'entrée décrivant ce contexte est légitime ; une assertion destinée à fabriquer le résultat attendu ne l'est pas. Ne pas déduire une nouvelle contrainte d'une option par intuition : lire le contrat et contrôler le type obtenu.

Réserver un fichier complémentaire à une différence qui gagne à être développée séparément, notamment une option disponible dans une seule forme d'appel ou une inférence plus subtile. Ce choix dépend de l'apport et de la longueur de l'extrait, pas du seul nombre de surcharges.

Pour démontrer l'effet d'une option, d'une contrainte ou d'une forme d'appel, rendre le **cas de référence** visible dans la même page : entrée, résultat ou type avant la variation, puis après. Garder autant que possible les mêmes données et ne changer que le facteur étudié. Une différence commentée sans référence observable n'est pas une démonstration. Principal et compléments doivent se répondre dans un ordre compréhensible ; un complément n'est pas un exemple isolé sans lien avec le reste.

Appliquer les règles de composition et d'inférence d'AgentKit. Indenter les imbrications avec des tabulations et aérer les appels contenant une callback ou une expression longue. Les pipes ont un argument par ligne, une virgule finale et une fermeture séparée ; leurs appels curifiés restent directement dans les étapes. Les imports et appels courts avec arguments simples peuvent tenir sur une ligne.

Relire l'exemple en nommant la capacité effectivement démontrée. Si elle relève surtout d'une autre fonction, recentrer ou remplacer l'exemple. Conserver les erreurs intentionnelles utiles déjà présentes ; préférer une requête sur un type correctement propagé à une erreur ajoutée artificiellement.

## Annotations disponibles

Syntaxes confirmées dans les plugins et la version installée de Twoslash lors de la création du skill ; les revérifier si la dépendance ou la configuration change :

| Besoin | Syntaxe et emploi |
| --- | --- |
| Montrer le type inféré | `//    ^?` immédiatement sous la ligne qui porte l'identifiant ciblé, à la bonne colonne ; pour un appel multiligne, viser la déclaration ou une référence ultérieure au résultat, pas la parenthèse de fermeture ; vérifier le type effectivement affiché |
| Mettre en évidence une expression | `//    ^^^` sous sa plage de caractères ; contrôler visuellement la sélection |
| Masquer une préparation compilée | `// ---cut-before---` avant la partie visible ; `// ---cut-after---` après ; garder la partie utile au lecteur |
| Masquer une portion intermédiaire | `// ---cut-start---` et `// ---cut-end---` autour de cette portion |
| Diagnostic attendu | `// @errors: 2345` pour ce code précis, seulement lorsque le diagnostic est intentionnel |
| Annotation textuelle | `// @annotate: ...`, `// @log: ...`, `// @warn: ...`, `// @error: ...` ; tags explicitement activés par le projet, pas des résultats calculés |

Le masquage conserve la vérification du code ; ce n'est pas un repli interactif. Aucune directive de repli spécifique n'est établie par ce skill. Si un repli devient utile, consulter l'implémentation ou la documentation officielle correspondant à la version installée et tester le rendu avant d'en choisir la syntaxe. Ne pas accumuler des annotations décoratives ou des assertions de types dans le code visible.

Choisir les requêtes de type avec **parcimonie** : une différence d'inférence, un affinement ou une garantie mérite parfois d'être montré ; un résultat déjà évident ou accessible au survol ne demande pas systématiquement une fenêtre. Ne pas annoter chaque étape d'un pipe ni chaque variable.

Pour observer un résultat après un appel multiligne, une référence à la variable déjà définie peut porter la requête. Par exemple, avec une variable nommée `result` :

```ts
void result;
//   ^?
```

Le marqueur vise l'identifiant, pas `void` : il montre le type de la variable sans exécuter une transformation supplémentaire. C'est une possibilité de placement quand l'observation apporte quelque chose, pas une ligne à ajouter à tous les exemples ; une requête sous la déclaration reste également possible.

## Prévoir la place des annotations

Les fenêtres de types et diagnostics peuvent recouvrir les lignes suivantes. Lorsqu'un autre élément de code suit une requête `^?`, réserver comme point de départ **environ quatre lignes vides après le marqueur**, même pour une petite fenêtre. Augmenter ce dégagement pour un type multiligne, une union ou une structure plus longue, selon sa hauteur affichée et les retours à la ligne. Une ou deux lignes ne constituent pas une marge suffisante par défaut. Le marqueur reste immédiatement sous la ligne ciblée ; l'espacement se place après le marqueur, jamais entre celui-ci et l'identifiant.

Pour plusieurs observations proches, séparer les étapes afin qu'une fenêtre n'en masque pas une autre. Un type long peut nécessiter davantage d'espace ou un extrait autonome ; quatre lignes ne garantissent pas l'absence de recouvrement à toutes les largeurs. Vérifier le rendu en ouvrant les fenêtres et ajuster pour laisser le code suivant lisible. En fin d'extrait, lorsqu'aucun code ne suit, ne pas ajouter automatiquement cette marge : elle sert à protéger les lignes suivantes, pas à remplir le bas du bloc. La compilation seule ne valide pas cette lisibilité. Ne pas ajouter des espaces en fin de ligne pour simuler des lignes vides.

## Erreurs intentionnelles : deux vérifications complémentaires

Le fichier `.ts` contient `// @ts-expect-error Explication précise` immédiatement avant la ligne invalide, afin que le compilateur de projet vérifie aussi qu'une erreur existe. Le bloc Markdown déclare les codes exacts via `// @errors: ...` avant l'inclusion. Ne pas ajouter cette directive aux blocs sans erreur.

Le cache Twoslash, dans `twoslashCache.ts`, retire les directives `@ts-expect-error` avant l'analyse : Twoslash peut alors contrôler et afficher les diagnostics attendus. Le transformateur public en retire également le marqueur du rendu. Vérifier les deux circuits ; `@ts-expect-error` seul ne vérifie pas le code numérique du diagnostic.

Ne jamais utiliser `@ts-ignore`, `@noErrors`, `@noErrorValidation`, une assertion non justifiée ou un élargissement à `any` pour faire disparaître une erreur réelle. Ajouter un exemple invalide uniquement s'il aide à comprendre une règle de l'API ; sinon le supprimer.
