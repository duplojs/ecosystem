# Data Structures

Les Data Structures constituent le système de modélisation et de validation runtime de `@duplojs/lang`.

Contrairement au typage TypeScript, qui disparaît à l'exécution, une Data Structure est une représentation exploitable au runtime d'un contrat de données.

Elle permet notamment de :

* décrire précisément une donnée attendue;
* vérifier une valeur inconnue au runtime;
* produire après vérification un type TypeScript correspondant au contrat;
* ajouter des contraintes supplémentaires;
* encoder une donnée vers une représentation adaptée au transport;
* décoder cette représentation pour retrouver la donnée originale.

## Modèle général

Une Data Structure représente un contrat partagé entre le runtime et le système de types.

```text
Data Structure
    ↓
contrat de donnée
    ↓
vérification runtime
    ↓
valeur validée
    ↓
type TypeScript précis
```

L'objectif est de conserver une relation forte entre ce qui est réellement vérifié à l'exécution et ce qui est ensuite considéré comme valide par TypeScript.

## Organisation

Le système est construit autour de plusieurs niveaux ayant des responsabilités distinctes :

```text
Fundamental Type
      ↓
     Type
      ↓
  Structure
      +
 Constraints
```

Ces niveaux ne sont pas interchangeables.

Ils permettent notamment de conserver un système d'encodage générique dont le type de sortie peut être déterminé statiquement.

## Fundamental Types

Les `FundamentalType` représentent les catégories fondamentales de valeurs pouvant posséder une représentation encodée.

Ils définissent la nature de base d'une donnée et savent vérifier qu'une valeur appartient à cette catégorie.

Ils constituent également le point d'association avec les codecs.

Un codec n'est donc pas associé arbitrairement à une structure complète : il est associé à un `FundamentalType`.

Cette séparation permet de définir une seule fois la manière dont une catégorie fondamentale de données traverse une frontière entre deux représentations.

## Types

Les `Type` reposent sur un `FundamentalType` et permettent de préciser davantage la valeur attendue.

Un type conserve donc la nature fondamentale de la donnée tout en ajoutant éventuellement des règles supplémentaires.

Cela permet notamment de représenter des valeurs plus spécifiques, comme des littéraux :

```text
Fundamental Type
string
    ↓
Type
string littérale "admin"
```

Le `FundamentalType` détermine toujours la famille de la donnée et donc le codec pouvant être utilisé.

Le `Type` détermine plus précisément quelles valeurs appartenant à cette famille sont acceptées.

## Structures

Les `Structure` permettent de composer les types et les autres structures afin de représenter des données complexes.

Elles permettent notamment de construire :

* des objets;
* des tableaux;
* des records;
* des unions;
* et d'autres compositions de données.

Une structure ne définit pas son propre format d'encodage.

Elle orchestre l'encodage et le décodage de son contenu en utilisant les codecs associés aux `FundamentalType` rencontrés dans la donnée.

```text
Structure
├── propriété A → Fundamental Type → Codec A
├── propriété B → Structure
│   └── propriété C → Fundamental Type → Codec C
└── propriété D → Fundamental Type sans codec
```

Une valeur dont le `FundamentalType` ne possède pas de codec conserve sa représentation.

## Validation

Une structure est exploitable au runtime.

Elle peut recevoir une valeur inconnue et vérifier si cette valeur respecte le contrat qu'elle représente.

```text
unknown
   ↓
Structure
   ↓ check
valeur valide
   ↓
type inféré depuis la Structure
```

La Data Structure constitue ainsi la frontière entre une donnée qui n'est pas encore fiable et une donnée dont le contrat a réellement été vérifié.

Le type produit après validation doit correspondre aux garanties réellement établies par cette vérification.

## Contraintes

Les contraintes de Data Structure permettent d'ajouter des vérifications secondaires à une structure.

Elles servent à exprimer des propriétés qui ne sont pas couvertes uniquement par sa forme principale.

Lorsqu'une contrainte réussit :

```text
Structure
    ↓ validation principale
valeur valide
    ↓ contrainte
valeur plus précisément vérifiée
    ↓
type enrichi
```

Les contraintes runtime des Data Structures peuvent ainsi produire des valeurs enrichies avec les contraintes de typage de `@duplojs/lang`.

Le fonctionnement général des contraintes de typage est documenté dans [constraints.md](./constraints.md).

Les contraintes de Data Structure et les contraintes de typage ne doivent pas être confondues :

* une contrainte de Data Structure existe au runtime et effectue une vérification;
* une contrainte de typage existe uniquement dans TypeScript et représente la garantie obtenue après cette vérification.

## Codecs

Les codecs permettent de transformer une valeur entre deux représentations.

Pour un état `A` utilisé par l'application et un état `B` utilisé pour le transport :

```text
        encode
A ----------------> B

        decode
A <---------------- B
```

Le codec est réversible conceptuellement : la représentation encodée doit contenir suffisamment d'information pour permettre de reconstruire la valeur attendue lors du décodage.

Les codecs permettent notamment de faire traverser à une donnée des couches ayant des contraintes différentes sans perdre sa sémantique.

## Transport des données

Une donnée utile à une application ne doit pas être enfermée dans l'environnement runtime dans lequel elle a été créée.

Le système d'encodage permet de produire des représentations adaptées à des frontières comme :

```text
Application A
    ↓ encode

représentation transportable
    ↓ JSON / réseau / stockage

Application B
    ↓ decode

donnée originale
```

L'objectif est de préserver l'authenticité et la sémantique de la donnée même lorsqu'elle traverse une représentation plus limitée.

Une valeur complexe peut ainsi être transportée sans imposer que sa représentation métier soit directement compatible avec JSON.

## Inférence du type encodé

Le typage du codec fait partie intégrante du contrat.

À partir :

* d'une Structure;
* des `FundamentalType` qu'elle contient;
* des codecs fournis;

TypeScript doit pouvoir déterminer le type exact de la représentation encodée.

```text
Structure<A>
    +
Codecs
    ↓
EncodedValue<A, Codecs>
```

Le consommateur ne doit pas avoir à déclarer manuellement le type de l'état encodé.

Il doit être déduit à partir du schéma et des codecs disponibles.

Cette propriété explique notamment la séparation entre `FundamentalType`, `Type` et `Structure`.

Le codec étant attaché au `FundamentalType`, une structure complexe peut être parcourue et son type encodé calculé à partir des éléments fondamentaux qui la composent.

## Principes

Lors d'une modification du système de Data Structures :

* le comportement runtime et le typage doivent représenter le même contrat;
* une validation réussie ne doit exposer que les garanties réellement vérifiées;
* l'encodage et le décodage doivent préserver la sémantique de la donnée;
* les codecs doivent rester attachés aux `FundamentalType`;
* les structures composent les données et orchestrent les codecs sans définir un format de transport spécifique;
* le type encodé doit être inféré depuis la Structure et les codecs;
* les contraintes runtime doivent enrichir le type uniquement lorsque leur vérification a réellement réussi.
