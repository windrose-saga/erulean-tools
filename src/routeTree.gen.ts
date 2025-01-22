/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UnitsImport } from './routes/units'
import { Route as DamageCalculatorImport } from './routes/damage-calculator'
import { Route as AugmentsImport } from './routes/augments'
import { Route as ActionsImport } from './routes/actions'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const UnitsRoute = UnitsImport.update({
  id: '/units',
  path: '/units',
  getParentRoute: () => rootRoute,
} as any)

const DamageCalculatorRoute = DamageCalculatorImport.update({
  id: '/damage-calculator',
  path: '/damage-calculator',
  getParentRoute: () => rootRoute,
} as any)

const AugmentsRoute = AugmentsImport.update({
  id: '/augments',
  path: '/augments',
  getParentRoute: () => rootRoute,
} as any)

const ActionsRoute = ActionsImport.update({
  id: '/actions',
  path: '/actions',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/actions': {
      id: '/actions'
      path: '/actions'
      fullPath: '/actions'
      preLoaderRoute: typeof ActionsImport
      parentRoute: typeof rootRoute
    }
    '/augments': {
      id: '/augments'
      path: '/augments'
      fullPath: '/augments'
      preLoaderRoute: typeof AugmentsImport
      parentRoute: typeof rootRoute
    }
    '/damage-calculator': {
      id: '/damage-calculator'
      path: '/damage-calculator'
      fullPath: '/damage-calculator'
      preLoaderRoute: typeof DamageCalculatorImport
      parentRoute: typeof rootRoute
    }
    '/units': {
      id: '/units'
      path: '/units'
      fullPath: '/units'
      preLoaderRoute: typeof UnitsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/actions': typeof ActionsRoute
  '/augments': typeof AugmentsRoute
  '/damage-calculator': typeof DamageCalculatorRoute
  '/units': typeof UnitsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/actions': typeof ActionsRoute
  '/augments': typeof AugmentsRoute
  '/damage-calculator': typeof DamageCalculatorRoute
  '/units': typeof UnitsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/actions': typeof ActionsRoute
  '/augments': typeof AugmentsRoute
  '/damage-calculator': typeof DamageCalculatorRoute
  '/units': typeof UnitsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/actions' | '/augments' | '/damage-calculator' | '/units'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/actions' | '/augments' | '/damage-calculator' | '/units'
  id:
    | '__root__'
    | '/'
    | '/actions'
    | '/augments'
    | '/damage-calculator'
    | '/units'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ActionsRoute: typeof ActionsRoute
  AugmentsRoute: typeof AugmentsRoute
  DamageCalculatorRoute: typeof DamageCalculatorRoute
  UnitsRoute: typeof UnitsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ActionsRoute: ActionsRoute,
  AugmentsRoute: AugmentsRoute,
  DamageCalculatorRoute: DamageCalculatorRoute,
  UnitsRoute: UnitsRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/actions",
        "/augments",
        "/damage-calculator",
        "/units"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/actions": {
      "filePath": "actions.tsx"
    },
    "/augments": {
      "filePath": "augments.tsx"
    },
    "/damage-calculator": {
      "filePath": "damage-calculator.tsx"
    },
    "/units": {
      "filePath": "units.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
