// shadcn registry-item.json schema (loosely typed). See
// https://ui.shadcn.com/docs/registry/registry-item-json for the
// canonical reference.

export type RegistryItemType =
  | "registry:ui"
  | "registry:lib"
  | "registry:block"
  | "registry:hook"
  | "registry:theme"
  | "registry:style"
  | "registry:component";

export interface RegistryFile {
  /** Source path used in the registry tree. */
  path: string;
  /** Item type the file belongs to. */
  type: RegistryItemType;
  /** Optional install target (relative to consumer repo). */
  target?: string;
  /** Source content. */
  content: string;
}

export interface RegistryCssVars {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  theme?: Record<string, string>;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  /** npm package dependencies. */
  dependencies?: string[];
  /** Other registry items this one needs. May be name or absolute URL. */
  registryDependencies?: string[];
  files: RegistryFile[];
  /** Tailwind config extension. */
  tailwind?: {
    config?: {
      theme?: { extend?: Record<string, unknown> };
      plugins?: string[];
    };
  };
  /** CSS variable additions for globals.css. */
  cssVars?: RegistryCssVars;
  /** Free-form metadata used by the local index endpoint. */
  meta?: {
    /** Atomic taxonomy slot — atom / molecule / organism / template. */
    layer?: "foundation" | "atom" | "molecule" | "organism" | "template";
    /** Categories used by the shadcn registry MCP. */
    categories?: string[];
    /** Informational item version — signals breaking changes to consumers
     *  (shadcn copies files, so this is advisory, not enforced). */
    version?: string;
  };
}

export interface RegistryIndex {
  $schema?: string;
  name: string;
  homepage: string;
  items: Array<
    Pick<RegistryItem, "name" | "type" | "title" | "description"> & {
      meta?: RegistryItem["meta"];
    }
  >;
}
