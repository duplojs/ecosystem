# @duplojs/form
[![NPM version](https://img.shields.io/npm/v/@duplojs/form)](https://www.npmjs.com/package/@duplojs/form)

`@duplojs/form` is a structure-first, strongly typed form library for Vue.

Instead of wiring forms manually (value collection, validation plumbing, complex UI flows), you compose a `FormField` tree and let the library handle the form mechanics.

Provide your input components or use the ones already available, compose layouts, and you get a powerful form engine with reusable rendering and strong typing.

## What’s inside?

- `createForm(...)`: creates a reusable `useForm(...)` initializer bound to your templates.
- `createInput(...)`: turns your Vue components into reusable form inputs.
- Built-in layouts to model real-world forms:
  - `useMultiLayout`
  - `useRepeatLayout`
  - `useUnionLayout`
  - `useStepLayout`
  - `useSectionLayout`
  - `useSlotLayout`
  - `useCheckLayout`
  - `useDisabledLayout`
- Default implementations:
  - `@duplojs/form/vueGrid` + `@duplojs/form/vueGrid.css`
  - `@duplojs/form/vueDesignSystem` + `@duplojs/form/vueDesignSystem.css`

## Why this approach

- Structure-first approach: define the form structure once, then compose and reuse it.
- Logic is built-in: nested layouts, complex branches, step forms, and conditional disabling.
- Design freedom: keep your own design system and visual identity.
- Contract-based inputs: if your component respects the minimal input contract, it becomes a first-class form input with `createInput(...)`.
- End-to-end typing: from declared fields to checked output value.

## Core concepts

- Inputs and layouts both return `FormField`, so everything composes the same way.
- A form is initialized from one root `FormField`.
- `currentValue` is the live raw form state.
- `check()` executes validation for the full tree and returns checked output (or errors).
- Templates control rendering only, not business logic.
- Field validation is defined through `dataParser`; during `check()`, these parsers are executed and drive validation errors/messages.

## Install

```bash
npm install @duplojs/form@0 @duplojs/utils@1
```

## Documentation

https://form.duplojs.dev
