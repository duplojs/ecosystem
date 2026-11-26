## Process

Créer et composer des séquences réutilisables de steps, configurables par options, et exporter leurs données vers une route ou un autre process.

### [ProcessBuilder.check](10-check.ts)

Interpréter un checker dans une séquence et enrichir son floor local.
 
### [ProcessBuilder.cut](10-cut.ts)

Préparer des données locales ou interrompre une séquence réutilisable.
 
### [ProcessBuilder.exec et RouteBuilder.exec](10-exec.ts)

Exécuter un process dans une route ou un autre process, avec imports et options.
 
### [ProcessBuilder.exports](10-exports.ts)

Finaliser un process et choisir les données que ses appelants peuvent importer.
 
### [ProcessBuilder.extract](10-extract.ts)

Valider des données de requête et enrichir le floor local du process.
 
### [ProcessBuilder.presetCheck](10-presetCheck.ts)

Appliquer une interprétation de checker partagée dans un process.
 
### [useProcessBuilder](10-useProcessBuilder.ts)

Définir une séquence de steps réutilisable et ses options par défaut.
 
