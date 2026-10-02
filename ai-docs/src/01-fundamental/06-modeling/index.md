## Modélisation

La modélisation consiste à représenter explicitement les concepts, les états, les identités et les relations qui structurent un logiciel.

Elle ne concerne pas uniquement la forme des données. Elle permet également d'exprimer des règles de cycle de vie, des préconditions, des garanties de passage ou encore l'identité précise de certaines opérations.

Dans l'écosystème DuploJS, ces besoins sont notamment couverts par :

- les `NewType`, `Entity` et `TaggedObject` pour représenter précisément les données et leur identité ;
- les `Flag` et `Fact` pour représenter les états et les transitions d'un cycle de vie ;
- les `Evidence` pour prouver dans le typage qu'une valeur est passée par une opération particulière ;
- les `SignedFunction` pour donner une identité précise à une fonction au-delà de sa simple signature TypeScript.

L'objectif est de rendre explicites dans les types et les signatures des informations qui resteraient autrement implicites ou impossibles à représenter précisément avec TypeScript seul.