// Inspired by https://stackoverflow.com/a/68445879

type Diff<T, U> = T extends U ? never : T;

type Predicate<I, O extends I> = (i: I) => i is O;

const not = <I, O extends I>(p: Predicate<I, O>) =>
  (i: I): i is (Diff<I, O>) => !p(i);

/**
 * Checks if the given argument is undefined.
 * @param o any object
 */
export const isUndefined = <I>(o: I | undefined): o is undefined => o === undefined;

/**
 * Checks if the given argument is defined, i.e. not undefined.
 * @param o any object
 */
export const isDefined = not(isUndefined);

/**
 * Checks if the given argument is null.
 * @param o any object
 */
export const isNull = <I>(o: I | null): o is null => o === null;

/**
 * Checks if the given argument is not null.
 * @param o any object
 */
export const isNotNull = not(isNull);

/**
 * Checks if the given argument doesn't exist, i.e. is undefined or null.
 * @param o any object
 */
export const notExists = (o: unknown): o is undefined | null => isUndefined(o) || isNull(o);

/**
 * Checks if the given argument exists, i.e. is defined and not null.
 * @param o any object
 */
export const exists = not(notExists);
