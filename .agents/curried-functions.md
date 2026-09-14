# Fonctions curifiées

L'écosystème DuploJS peut exposer certaines fonctions sous une forme curifiée.

Cette forme existe principalement pour permettre leur composition avec `pipe`.

## Usage principal

Lorsqu'une opération reçoit une donnée ainsi que des paramètres supplémentaires, sa forme curifiée permet de fournir ces paramètres avant de recevoir la donnée transmise par `pipe`.

```ts
DCommon.pipe(
	values,
	DArray.filter((value) => value.enabled),
	DArray.map((value) => value.id),
);
```

La curryfication transforme ainsi conceptuellement :

```text
operation(data, parameters)
```

en :

```text
data
    ↓
operation(parameters)
    ↓
result
```

## Intention

Les formes curifiées de l'écosystème ne sont pas principalement conçues pour préparer une fonction qui sera exécutée ultérieurement.

Cet usage peut exister lorsque le contexte le justifie, mais il reste secondaire.

Dans la majorité des cas, une forme curifiée doit être comprise comme une adaptation d'une opération pour son utilisation dans `pipe`.

## Conception

Lorsqu'une fonction possède une forme curifiée :

* les paramètres configurant l'opération sont fournis avant la donnée;
* la fonction retournée reçoit la donnée à transformer;
* l'ordre des paramètres doit favoriser la composition avec `pipe`;
* le comportement et l'inférence de types doivent rester cohérents entre la forme directe et la forme curifiée.

Cette forme doit principalement permettre :

```ts
DCommon.pipe(
	array,
	DArray.map(mapper),
);
```

Lors de la conception d'une API curifiée, privilégier son utilisation naturelle dans une chaîne `pipe`.
