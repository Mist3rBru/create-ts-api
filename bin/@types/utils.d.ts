type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never

type UnionToTuple<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer ReturnType
  ? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
  : []

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false

type ObjectEntries<T extends Record<string, any>> = UnionToTuple<
  {
    [K in keyof T]-?: [K, T[K] extends infer U | undefined ? U : T[K]]
  }[keyof T]
>

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
