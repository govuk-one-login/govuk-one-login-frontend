// TODO remove unecessary

type Collection =
  | object
  | Array<unknown>
  | Set<unknown>
  | Map<unknown, unknown>;

/**
 * Performs a deep cloned merge of the supplied objects.
 * Arrays are cloned and overwritten, not merged.
 * Non-collection arguments (primitives, null, undefined) are silently ignored.
 */
declare function deepCloneMerge(
  ...sources: (Collection | undefined)[]
): Record<string, unknown>;

declare namespace deepCloneMerge {
  /**
   * Same as deepCloneMerge but handles circular references.
   */
  function circular(...sources: Collection[]): Record<string, unknown>;

  /**
   * Merges sources into an existing destination object rather than a new one.
   */
  function extend(
    dest: Collection,
    ...sources: Collection[]
  ): Record<string, unknown>;
}

export = deepCloneMerge;
