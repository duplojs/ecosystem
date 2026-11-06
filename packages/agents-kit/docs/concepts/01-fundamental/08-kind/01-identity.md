### Identité des objets avec les kinds

De nombreux objets DuploJS portent des kinds pour être reconnus et distingués malgré le typage structurel de TypeScript.

Ces clés textuelles au runtime, représentées sous un symbole dans les types, portent identité et métadonnées. Leur reconnaissance survit au transport si la sérialisation les préserve.

Les kinds servent surtout à construire les outils ; utiliser DuploJS ne demande généralement pas de les manipuler directement.
