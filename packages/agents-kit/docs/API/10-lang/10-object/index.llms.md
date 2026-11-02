## DObject

Fonctions fonctionnelles pour lire, discriminer, transformer, fusionner et reconstruire des objets en conservant les informations de typage utiles.

### [DObject.assign](10-assign.ts)

Fusionner les propriétés d’un objet dans une nouvelle valeur.
 
### [DObject.countKeys](10-countKeys.ts)

Compter les clés runtime d’un objet.
 
### [DObject.deepDiscriminate](10-deepDiscriminate.ts)

Discriminer une union d’objets à partir d’une propriété imbriquée.
 
### [DObject.deepOverride](10-deepOverride.ts)

Remplacer récursivement les valeurs définies d’un objet sans modifier la source.
 
### [DObject.discriminate](10-discriminate.ts)

Discriminer une union d’objets à partir d’une propriété.
 
### [DObject.discriminateEntryKey](10-discriminateEntryKey.ts)

Tester ou affiner une entrée selon sa clé.
 
### [DObject.discriminateEntryValue](10-discriminateEntryValue.ts)

Tester ou affiner une entrée selon sa valeur.
 
### [DObject.entries](10-entries.ts)

Convertir les propriétés d’un objet en entrées typées.
 
### [DObject.entry](10-entry.ts)

Construire une entrée objet en conservant les types de sa clé et de sa valeur.
 
### [DObject.fromEntries](10-fromEntries.ts)

Reconstruire un objet typé à partir d’une collection d’entrées.
 
### [DObject.getDeepProperty](10-getDeepProperty.ts)

Lire une propriété imbriquée avec un chemin vérifié par TypeScript.
 
### [DObject.getProperty](10-getProperty.ts)

Lire une propriété d’un objet en conservant son type.
 
### [DObject.hasKeys](10-hasKeys.ts)

Vérifier la présence de propriétés définies et affiner leur caractère obligatoire.
 
### [DObject.isSimple](10-isSimple.ts)

Identifier les objets simples utilisables comme enregistrements de propriétés.
 
### [DObject.keys](10-keys.ts)

Lister les clés d’un objet avec un type correspondant à ses propriétés.
 
### [DObject.omit](10-omit.ts)

Créer un objet en retirant les propriétés sélectionnées.
 
### [DObject.override](10-override.ts)

Remplacer les propriétés définies d’un objet par de nouvelles valeurs.
 
### [DObject.pick](10-pick.ts)

Créer un objet avec les propriétés sélectionnées.
 
### [DObject.to](10-to.ts)

Construire un nouvel objet en appliquant une forme de transformations à une même entrée.
 
### [DObject.transformProperties](10-transformProperties.ts)

Transformer plusieurs propriétés d’un objet en conservant les autres.
 
### [DObject.transformProperty](10-transformProperty.ts)

Transformer une propriété précise d’un objet.
 
### [DObject.values](10-values.ts)

Extraire les valeurs d’un objet avec l’union des types de ses propriétés.
 
