# @duplojs/agents-kit

Socle initial du package `@duplojs/agents-kit`.

La commande `install` crée par défaut des liens symboliques vers les skills du package.
L’option booléenne `--copy` copie les skills à la place.
À chaque installation, la destination du skill est supprimée puis remplacée par la copie ou le lien demandé. La cible d’un ancien lien symbolique est conservée.

```sh
pnpm exec duplojs-agents-kit install
pnpm exec duplojs-agents-kit install http --type codex
pnpm exec duplojs-agents-kit install http --copy
```

Ce package suit la configuration des packages DuploJS orientés serveur et peut être exécuté dans Node.js, Bun et Deno. Les configurations devront être spécialisées lorsque le package ajoutera ses domaines, ses exports ou des dépendances propres à une plateforme.
