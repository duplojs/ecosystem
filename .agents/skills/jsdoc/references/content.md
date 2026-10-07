# Redaction du contenu JSDoc

La documentation inseree dans les fichiers `jsDoc/` est redigee en anglais.

Elle doit etre concise, orientee utilisateur et centree sur l'API publique.

## Structure d'un `index.md`

Respecter cet ordre :

1. Description courte de la fonction.
2. Section `**Supported call styles:**` lorsque la fonction possede plusieurs formes d'appel ou lorsque la distinction directe/curifiee est utile.
3. Informations comportementales importantes, par exemple l'immutabilite de l'entree.
4. Bloc d'exemple TypeScript qui inclut un fichier `.ts`, souvent avec une plage de lignes.
5. Section `@remarks` uniquement lorsqu'une precision importante ne se voit pas dans la signature.
6. Liens `@see` vers les fonctions proches et vers la page de documentation officielle.
7. Tag `@namespace` lorsque la fonction est exposee sous un namespace public.

Exemple de forme attendue :

````md
Maps each element of an array and returns a new array containing the mapped values.

**Supported call styles:**
- Classic: `map(array, theFunction)` -> returns a new array
- Curried: `map(theFunction)` -> returns a function waiting for the array

The input array is not mutated.

```ts
{@include array/map/example.ts[3,18]}
```

@remarks
- The callback receives the current element and contextual information about its index and source array.

@see [`DArray.filter`](https://lang.duplojs.dev/en/api/array/filter) For keeping only matching values
@see https://lang.duplojs.dev/en/api/array/map

@namespace DArray
````

## Description

La description doit tenir en une a trois phrases.

Elle doit dire ce que la fonction permet de faire, pas comment elle est implementee.

Ne pas repeter chaque type de parametre dans la description lorsque la signature TypeScript le montre deja.

## Styles d'appel

Lister les styles d'appel publics avec les noms des parametres, sans types.

```md
**Supported call styles:**
- Classic: `functionName(input, option)` -> returns the computed value
- Curried: `functionName(option)` -> returns a function waiting for the input
```

Pour les fonctions concues pour `pipe`, montrer la forme curifiee dans un exemple avec `DCommon.pipe`.

Pour un predicate, preciser le narrowing lorsque c'est une partie importante du contrat.

```md
- Predicate: `isSomething(value)` -> narrows the value when it returns `true`
- Curried predicate: `isSomething(option)` -> returns a predicate waiting for the value
```

## Exemples TypeScript

Les exemples doivent etre ecrits dans un fichier `.ts`, generalement `example.ts`, puis inclus depuis `index.md`.

````md
```ts
{@include array/map/example.ts[3,18]}
```
````

Les plages de lignes sont inclusives et commencent a 1.

Les plages de lignes servent a faire un zoom sur ce qui aide vraiment a comprendre la fonction. La fenetre JSDoc est petite : ne pas y afficher les imports, le setup technique ou les declarations de support lorsque ces elements ne sont pas le sujet.

Le fichier `example.ts` peut contenir des imports, constantes, interfaces ou donnees de setup avant la plage incluse. Ces elements restent typables, mais la documentation affiche seulement le fragment utile.

Les exemples doivent etre courts, didactiques et typables. Ils doivent montrer les usages courants :

* appel direct lorsque la fonction le supporte ;
* appel curifie dans `DCommon.pipe` lorsque la fonction le supporte et que cela clarifie son usage ;
* narrowing dans un `if` pour un predicate direct ;
* usage avec `DCommon.when` pour un predicate curifie lorsque ce style fait partie de l'API ;
* cas important de contrainte TypeScript lorsque c'est le coeur de la fonction.

Pour les fonctions concues pour la composition, privilegier quand c'est naturel un petit flux de deux ou trois operations dans `DCommon.pipe`. L'objectif est de montrer comment la fonction s'insere dans l'ecosysteme DuploJS, sans transformer l'exemple en cas metier complexe.

Ne pas inclure d'exemple complexe uniquement pour demontrer l'implementation. Un exemple doit rester comprehensible en quelques secondes.

## Includes recursifs

`@duplojs/jsdoc-include` resout les includes recursivement.

Un fichier `index.md` peut donc inclure `example.ts`, et un fichier inclus peut lui-meme inclure un autre fragment.

Utiliser cette possibilite pour garder les exemples typables ou partager un fragment utile, mais eviter les assemblages trop fragmentes qui rendent la documentation difficile a lire.

Le plugin detecte les inclusions recursives circulaires et echoue dans ce cas. Ne jamais creer de cycle d'includes.

## `@remarks`

Utiliser `@remarks` avec parcimonie.

Une remarque est pertinente lorsqu'elle eclaire une zone grise : un comportement important que la description, la signature et les exemples ne rendent pas assez explicite.

Cela concerne notamment :

* compatibilite avec une API JavaScript native ;
* valeur par defaut influente ;
* option ou parametre qui active un mode particulier ;
* preservation ou perte d'une contrainte de type ;
* comportement limite a un cas precis ;
* comportement atypique ou contre-intuitif ;
* absence de mutation lorsque cela peut etre ambigu.

Si une information est centrale pour comprendre la fonction, l'integrer plutot dans la description ou les exemples. Utiliser `@remarks` pour les precisions importantes mais secondaires, celles qui evitent une mauvaise interpretation sans alourdir l'introduction.

Ne pas creer de `@remarks` pour reformuler la description, ni pour documenter chaque detail mineur. Trop de remarques rendent les vraies alertes moins visibles.

## `@see`

Ajouter au moins un lien `@see` vers la page officielle de la fonction.

La base de l'URL vient du champ `homepage` du `package.json` du package courant.

Lorsque des fonctions proches existent, ajouter des liens `@see` vers elles avec une courte indication d'usage.

```md
@see [`DArray.filter`](https://lang.duplojs.dev/en/api/array/filter) For keeping matching values
@see https://lang.duplojs.dev/en/api/array/map
```

Verifier l'architecture de documentation du package avant de figer le chemin final. Ne pas inventer une URL definitive lorsqu'aucune convention n'est observable ; dans ce cas, utiliser la homepage du package ou signaler l'incertitude.

## `@namespace`

Ajouter `@namespace` lorsque la fonction est exposee via un namespace public.

Lire l'index racine du package et les index de domaine pour identifier le namespace reel.

Dans `@duplojs/lang`, les domaines exposent notamment des namespaces longs comme `DArray`, `DString`, `DCommon`, `DEither`, `DNumber`, `DTuple`, ainsi que certains aliases courts. La JSDoc doit privilegier le namespace long.

Exemple :

```md
@namespace DArray
```

Ne pas ajouter de namespace lorsqu'une fonction est exposee directement depuis la racine sans namespace d'usage pertinent.

## Qualite attendue

Avant de terminer, verifier :

* le chemin `{@include ...}` depuis le code source ;
* les chemins `{@include ...}` internes a `jsDoc/`;
* la coherence entre description, overloads, exemples et typage ;
* la presence d'un lien de documentation officiel ;
* la presence du namespace lorsque l'API en possede un ;
* la compilation TypeScript des exemples ;
* le build du package lorsque le plugin est configure.
