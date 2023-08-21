/**
 * Join 类型用于连接类型 K 和 P。当 K 和 P 都是字符串或数字时，
 * 它们将以 '.' 连接，否则返回 `never` 类型。
 *
 * 例如：
 * type T1 = Join<'a', 'b'>;  // 结果是 'a.b'
 * type T2 = Join<1, 'b'>;   // 结果是 '1.b'
 */
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

/**
 * DropFirstInTuple 类型用于移除元组的第一个元素。如果 T 是一个元组，
 * 它返回一个新的元组，去除了第一个元素，否则返回原来的类型 T。
 *
 * 例如：
 * type T1 = DropFirstInTuple<[1, 2, 3]>;  // 结果是 [2, 3]
 * type T2 = DropFirstInTuple<[string, number]>;  // 结果是 [number]
 */
type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (
  arg: any,
  ...rest: infer U
) => any
  ? U
  : T;

/**
 * Prev 类型用于获取除第一个元素之外的所有元素。
 *
 * 例如：
 * type T1 = Prev<[1, 2, 3]>;  // 结果是 [2, 3]
 */
type Prev<T extends any[]> = DropFirstInTuple<T>;

/**
 * DeepKeys 类型用于获取嵌套对象的所有键，连接方式为 '.'。例如，对于对象 { a: { b: 1 } }，
 * 它将返回 'a' 和 'a.b'。类型 D 用于限制深度，默认为 10。
 *
 * 例如：
 * type Obj = { a: { b: { c: number } } };
 * type T1 = DeepKeys<Obj>;  // 结果是 'a' | 'a.b' | 'a.b.c'
 */
declare type DeepKeys<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, DeepKeys<T[K], Prev[D]>> }[keyof T]
  : '';
