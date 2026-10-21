---
title: "DString.split — découper une chaîne"
description: "DString.split découpe une chaîne avec un séparateur texte ou une expression régulière et peut limiter le nombre de morceaux retournés."
outline: [2, 3]
pageClass: docs-layout-api
prev:
  text: "String"
  link: "/fr/v1/api/lang/string/"
next:
  text: "String"
  link: "/fr/v1/api/lang/string/"
---

# split

`DString.split` découpe une chaîne selon un séparateur texte ou une expression régulière. Une limite facultative permet de restreindre le nombre de morceaux retournés.

## Exemple

```ts twoslash
<!--@include: @/examples/v1/api/lang/string/split.ts-->
```

## Syntaxe

Les signatures utilisent `SplitOutput`, un type interne qui calcule les garanties de taille du tableau à partir des types de la chaîne et du séparateur. Ce nom n'est pas un type à importer.

### Signature curifiée

```ts
export function split<
	GenericString extends string,
	GenericSeparator extends string,
>(
	separator: GenericSeparator | RegExp,
): (
	string: GenericString,
) => SplitOutput<GenericString, GenericSeparator>;
```

### Signature directe

```ts
export function split<
	GenericString extends string,
	GenericSeparator extends string,
	GenericLimit extends number,
>(
	string: GenericString,
	separator: GenericSeparator | RegExp,
	params?: SplitParams<GenericLimit>,
): SplitOutput<GenericString, GenericSeparator, GenericLimit>;
```

### Type auxiliaire

```ts
export interface SplitParams<
	GenericLimit extends number,
> {
	limit: GenericLimit & DNumber.RequirePositiveInteger<GenericLimit>;
}
```

## Paramètres

- `string` : chaîne à découper.
- `separator` : texte recherché ou expression régulière utilisée comme séparateur.
- `params` : paramètres facultatifs. `limit` fixe le nombre maximal de morceaux ; son type doit satisfaire la vérification statique d'entier positif, et `0` est accepté.

## Valeur de retour

La fonction retourne un tableau typé en lecture seule dont les éléments sont des chaînes. Quand la chaîne et le séparateur sont connus comme littéraux, TypeScript peut calculer le nombre de morceaux et en garantir la longueur. Pour une chaîne générale ou lorsque le séparateur ne permet pas ce calcul, le type conserve une garantie minimale plutôt qu'une longueur exacte.

À l'exécution, le séparateur et la limite suivent le comportement de `String.prototype.split`. Une limite de `0` retourne donc un tableau vide.

## Voir aussi

- [DArray.map](/fr/v1/api/lang/array/map) — transformer les morceaux obtenus.
