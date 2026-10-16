# Contraintes, déclarations et validation

## Une garantie doit avoir une origine

Une contrainte exprime dans le typage une propriété de la valeur : entier, borne, longueur ou format. Une intersection cumule les garanties, par exemple `number & DNumber.Integer & DNumber.LessThan<25>`.

Déclarer ce type ne valide rien et ne transforme pas la valeur. La garantie vient d'une validation runtime, d'un prédicat qui affine le type, d'une fonction qui préserve cette propriété ou d'un calcul de compatibilité sur une information déjà connue statiquement.

## Entrées : décrire le contrat complet

Une donnée reçue à une frontière externe passe par un data parser avant d'être considérée fiable. Une `DDataStructure` porte un schéma commun au runtime et au typage ; ses contraintes précisent le contrat au-delà de la nature de la donnée. Dans les fonctions internes, réutiliser les garanties déjà établies et suivre celles que les transformations conservent.

Voir [un contrat et sa validation](examples/input-validation.ts).

Choisir les contraintes selon les règles du besoin : bornes inclusives ou exclusives des nombres, minimum, maximum ou longueur exacte des chaînes et tableaux, formats, etc. Chaque contrainte d'une structure doit être compatible avec le type de donnée décrit.

Pour les entrées gérées par l'écosystème, chercher comment le module qui les reçoit accepte des structures et lui fournir le contrat. Exploiter ensuite les valeurs déjà validées. À une frontière qui n'offre pas cette intégration, appeler explicitement la validation et traiter son `Either`.

Exemples d'intégrations : `DSCommand.createArgument` et `DSCommand.createOption` pour une commande ; `.extract(...)` pour une route `@duplojs/http`. La règle s'applique à tout module qui reçoit des données externes.

## `cast` : compatibilité calculée par TypeScript

`DCommon.cast` restitue la valeur sans validation runtime. Le type attendu donne la cible du calcul. Une garantie plus forte peut impliquer une garantie plus faible ; un littéral peut aussi fournir assez d'information.

Voir [les conversions de contraintes et les déclarations littérales](examples/cast.ts).

Ce calcul de types comble les implications que TypeScript ne déduit pas de lui-même. Il n'y a pas de calcul dynamique de validité lors de l'exécution. Une simple `string` ou un simple `number` provenant du runtime ne prouve pas une longueur, un format ou une borne.

Si `cast` émet une erreur, considérer que la compatibilité n'est pas établie. Une règle personnalisée peut ne pas avoir de support de calcul enregistré. Ne pas remplacer ce refus par `as`, une double assertion ou un helper qui fabrique la contrainte sans preuve. Vérifier l'inférence, valider par une structure ou un prédicat adapté, ou utiliser une autre construction sûre.

## `infer` : conserver également le littéral

Préférer `cast` dans le cas courant. Utiliser `DCommon.infer` lorsqu'une valeur connue statiquement doit garder son type littéral en plus des contraintes calculées. Cette fonction exige une entrée littérale ; elle ne sert pas à valider une donnée runtime.

Voir [la conservation du littéral dans une propriété](examples/infer.ts).

## Difficulté d'inférence : cible d'un paramètre générique direct

Lorsque `cast` ou `infer` est passé à un paramètre lui-même générique, TypeScript peut ne pas fournir une cible assez précise au calcul. Si le type attendu n'est pas inféré dans cette situation, l'expliciter avec `satisfies` immédiatement après l'appel. Ce traitement répond à une difficulté de contexte ; il n'est pas nécessaire à chaque utilisation de ces fonctions.

Voir [le calcul des contraintes avec un paramètre générique direct](examples/generic-inference.ts).

`satisfies` fournit le contexte du calcul ; il ne contourne pas la validation. Une propriété contrainte d'un objet générique peut déjà fournir ce contexte, comme dans [l'exemple de propriété littérale](examples/infer.ts) : ne pas ajouter ce contournement d'inférence partout.

## Déclarations spécialisées et Chrono

Les domaines proposent aussi des helpers pour les valeurs connues. Préférer ces déclarations sûres à `OrThrow`.

Voir [les déclarations de chemins et de valeurs Chrono](examples/safe-declarations.ts).

Vérifier la surcharge réellement utilisée : le type de l'argument détermine si la fonction retourne directement la valeur ou un `Either`.

## Les contraintes simplifient les opérations suivantes

Voir [les accès garantis après validation du tableau](examples/guaranteed-array-access.ts).

`MinElements<2>` garantit les indices `0` et `1` et l'existence du dernier élément. L'indice `2` reste incertain : un minimum de deux n'impose pas un maximum de deux. Les éléments garantis sont retournés directement, sans `Maybe` ni `undefined` ajouté pour une éventuelle absence. Une borne maximale ou une longueur exacte peut aussi permettre de prouver qu'un indice est absent.

Exploiter ces garanties sans garde redondante ni assertion. Respecter cependant le type propre aux éléments : un tableau dont les éléments peuvent eux-mêmes être `undefined` conserve cette possibilité. Après une transformation, suivre les contraintes du résultat ; un filtre peut supprimer des éléments et perdre une garantie de minimum.

Pour approfondir, rechercher les contraintes, les data structures, Chrono ou l'intégration du module concerné dans `docs/concepts.llms.md`, depuis la racine AgentKit indiquée par les instructions du projet.
