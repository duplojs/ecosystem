#### Composants et champs fournis

Choisir les inputs et commandes Vue du design system.

---

Les fonctions `useTextInput`, `useTextareaInput`, `useNumberInput`, `useFileInput`, `useSelectInput`, `useRadioGroup`, `useCheckbox`, `useCheckboxPolicy`, `useRangeInput`, `useDualRangeInput`, `useDateInput`, `useRangeDateInput`, `useTimeInput` et `useRangeTimeInput` produisent des champs `FormField`. Elles acceptent les paramètres de `createInput`, dont `label`, `defaultValue`, `props` et `dataStructure`.

Les valeurs initiales sont respectivement une chaîne vide pour les textes, zéro pour nombre et plage simple, `null` pour fichier, sélection et radio, `false` pour les cases, `{ start: 0, end: 100 }` pour la double plage, la date courante pour la date et des valeurs Chrono pour les dates et heures. Les intervalles date et heure utilisent `{ from, to }`. Les sélections et radios reçoivent leurs choix dans `props.options` ; les fichiers acceptent notamment `accept` et `multiple`.

Les composants Vue correspondants sont aussi exportés pour une utilisation directe ou avec `createInput`. Les boutons `PrimaryButton`, `OutlineButton`, `DestructiveButton`, `GhostButton` et `TheButton` servent aux actions de l'interface. Les adaptateurs `templateFormAddButton`, `templateFormRemoveButton`, `templateFormResetButton`, `templateFormNextButton`, `templateFormPreviousButton` et `templateFormSelect` répondent aux contrats de commandes de Grid. Charger les styles avec `@duplojs/form/vueDesignSystem.css` et `@duplojs/form/vueGrid.css` dans l'application.
