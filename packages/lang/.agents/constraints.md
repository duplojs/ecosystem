# Contraintes de typage

Les contraintes sont un mécanisme fondamental de `@duplojs/lang`.

Elles permettent d'enrichir les types TypeScript avec des garanties que le système de types natif ne permet pas toujours de représenter suffisamment précisément.

Elles peuvent notamment être appliquées aux nombres, aux strings et aux tableaux.

## Principe

Une contrainte existe uniquement dans le système de types.

Elle n'ajoute aucune information à la valeur runtime et n'effectue par elle-même aucune vérification.

Par exemple, un type peut représenter un nombre garanti supérieur ou égal à `15`, sans que cette information existe dans la valeur JavaScript correspondante.

La contrainte représente donc avant tout une **preuve qu'une propriété de la valeur a été vérifiée en amont**.

```text
valeur inconnue
    ↓
vérification
    ↓
valeur typée avec une contrainte
```

Le type ne garantit pas directement l'état runtime de la valeur. Il garantit que, dans un usage respectant le système de types, la valeur est passée par un mécanisme capable d'établir cette propriété.

## Predicates

Les predicates constituent le principal moyen d'établir une contrainte depuis une valeur runtime.

Un predicate :

1. reçoit une valeur;
2. vérifie réellement une propriété de cette valeur;
3. retourne le résultat de cette vérification;
4. enrichit le type de la valeur lorsque la vérification réussit.

La contrainte matérialise ensuite dans le système de types le résultat de cette vérification.

```text
runtime                          TypeScript

value
  ↓
predicate(value)
  ↓ true
                                 value & Constraint
```

Une contrainte destinée à représenter une propriété vérifiable doit donc généralement être associée à un predicate capable de l'établir.

## Data structures

Les data structures utilisent les mêmes mécanismes pour produire des données respectant directement les contrats définis par leurs schémas.

Lorsqu'une data structure contient une contrainte, la valeur est vérifiée avant d'être exposée avec le type correspondant.

Par exemple, une data structure décrivant un nombre ayant un minimum de `15` produit après validation une valeur portant également cette information dans son type.

Les data structures permettent ainsi de faire entrer des données externes ou inconnues dans une partie du programme avec des garanties précises.

## Inférence

Certaines contraintes peuvent être déterminées directement à partir d'une valeur connue suffisamment précisément par TypeScript.

`DCommon.infer` permet d'inférer les contraintes compatibles à partir de cette information statique.

Il n'effectue aucune vérification runtime.

Son rôle est d'exploiter une information déjà connue par le compilateur pour produire un type contraint plus précis.

Il est notamment utilisé avec les valeurs littérales et les structures dont le contenu est connu statiquement.

## Cast

`DCommon.cast` permet de convertir une valeur vers un type contraint lorsque le système de types peut démontrer que la conversion est compatible.

Le cast n'effectue lui non plus aucune vérification runtime.

Il sert à transformer une preuve déjà disponible dans le système de types, et non à créer arbitrairement une garantie qui n'existe pas.

Un `cast` ne doit donc jamais être considéré comme une alternative à un predicate lorsqu'une donnée doit réellement être vérifiée.

## Propagation

Une contrainte peut être affectée par une transformation.

Toute fonction manipulant une valeur contrainte doit déterminer ce qu'elle peut encore garantir sur sa sortie.

Une contrainte peut être :

* conservée lorsqu'elle reste nécessairement vraie;
* transformée lorsqu'une nouvelle garantie peut être calculée;
* précisée lorsque l'opération apporte davantage d'information;
* supprimée lorsqu'elle ne peut plus être garantie.

La propagation des contraintes fait partie du contrat de typage des primitives de `@duplojs/lang`.

## Immutabilité

Une contrainte décrit une propriété vérifiée à un instant donné.

Une mutation incontrôlée peut rendre cette information incorrecte sans que TypeScript puisse nécessairement le détecter.

L'immutabilité et l'utilisation de structures `readonly` permettent donc de préserver la validité des garanties portées par les contraintes au cours de la vie d'une valeur.

Cette propriété est cohérente avec le principe général de `@duplojs/lang` consistant à privilégier les transformations plutôt que les mutations.

## Contraintes propres aux domaines

Les contraintes concrètes sont définies par les domaines auxquels elles appartiennent.

Par exemple, le domaine `array` définit des contraintes liées à la cardinalité d'un tableau, tandis que les domaines `number` et `string` peuvent exprimer d'autres propriétés propres à leurs valeurs.

Les `AGENTS.md` de ces domaines documentent leurs contraintes spécifiques et les règles particulières de propagation associées.

## Terminologie

Les contraintes de typage décrites ici ne doivent pas être confondues avec les objets `Constraint` du domaine `dataStructure`.

Les contraintes de typage existent uniquement dans TypeScript.

Les contraintes de `dataStructure` sont des composants runtime utilisés pour effectuer des validations et peuvent ensuite contribuer à produire des valeurs portant des contraintes de typage.
