# Importations HTTP

Cette règle complète les [règles d’importation de l’écosystème](../../../.agents/importations.md).

## Imports nommés pour HTTP

Les imports de `@duplojs/http` et de ses sous-exports utilisent directement les symboles nommés, y compris pour les types. Ne pas créer de namespace pour les regrouper avec `import * as` ou `import type * as` : HTTP n’expose pas de namespace dédié.

```ts
import { useRouteBuilder, type Route } from "@duplojs/http";
import { createHttpClient } from "@duplojs/http/client";
import { createHttpServer } from "@duplojs/http/node";
import { openApiGeneratorPlugin, type OpenApiDocument } from "@duplojs/http/openApiGenerator";
```

Cette exception concerne uniquement HTTP. Les autres packages de l’écosystème conservent leurs imports par namespace depuis le sous-export approprié.

Chaque déclaration d’import reste sur une seule ligne.
