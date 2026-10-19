## DGenerator

Création et composition de génératrices synchrones ou asynchrones pour produire, transformer, filtrer, réduire et consommer des séquences de valeurs.

### [DGenerator.asyncChunk](10-asyncChunk.ts)

Regrouper les valeurs d’un itérable asynchrone en sous-itérables de taille bornée.
 
### [DGenerator.asyncConcat](10-asyncConcat.ts)

Enchaîner plusieurs itérables synchrones ou asynchrones dans un générateur asynchrone.
 
### [DGenerator.asyncFilter](10-asyncFilter.ts)

Conserver dans un générateur asynchrone les valeurs acceptées par un prédicat.
 
### [DGenerator.asyncFlat](10-asyncFlat.ts)

Aplatir récursivement les valeurs itérables d’un générateur asynchrone jusqu’à une profondeur donnée.
 
### [DGenerator.asyncGroup](10-asyncGroup.ts)

Regrouper les valeurs d’un itérable asynchrone selon les sorties nommées d’une callback.
 
### [DGenerator.asyncLoop](10-asyncLoop.ts)

Produire une séquence asynchrone dans un pipe en distinguant l’arrêt avec ou sans dernière valeur émise.
 
### [DGenerator.asyncMap](10-asyncMap.ts)

Transformer chaque valeur dans un générateur asynchrone, en autorisant une callback synchrone ou asynchrone.
 
### [DGenerator.asyncReduce](10-asyncReduce.ts)

Réduire un itérable avec un accumulateur et des sorties next ou exit dans une promesse.
 
### [DGenerator.chunk](10-chunk.ts)

Regrouper les valeurs d’un itérable en sous-itérables de taille bornée.
 
### [DGenerator.concat](10-concat.ts)

Enchaîner plusieurs itérables dans un générateur synchrone.
 
### [DGenerator.createExternalAsyncGenerator](10-createExternalAsyncGenerator.ts)

Créer un générateur asynchrone dont la prochaine valeur ou la fin sont déclenchées de l’extérieur.
 
### [DGenerator.execute](10-execute.ts)

Consommer une génératrice jusqu’à sa fin, en retournant une promesse pour les génératrices asynchrones.
 
### [DGenerator.filter](10-filter.ts)

Conserver dans un générateur les valeurs acceptées par un prédicat.
 
### [DGenerator.flat](10-flat.ts)

Aplatir récursivement les valeurs itérables jusqu’à une profondeur donnée.
 
### [DGenerator.group](10-group.ts)

Regrouper les valeurs d’un itérable selon les sorties nommées d’une callback.
 
### [DGenerator.groupOutput](10-groupOutput.ts)

Construire une sortie nommée destinée à la fonction de regroupement.
 
### [DGenerator.loop](10-loop.ts)

Produire une séquence dans un pipe en distinguant l’arrêt avec ou sans dernière valeur émise.
 
### [DGenerator.map](10-map.ts)

Transformer chaque valeur d’un itérable dans un générateur.
 
### [DGenerator.reduce](10-reduce.ts)

Réduire un itérable avec un accumulateur et des sorties next ou exit.
 
### [DGenerator.reduceFrom](10-reduceFrom.ts)

Marquer une valeur initiale, éventuellement élargie par un générique, pour une réduction.
 
