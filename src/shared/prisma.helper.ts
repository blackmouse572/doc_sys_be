export default class PrismaHelper {
  public static exclude<T, Key extends keyof T>(
    result: T,
    keys: Key[],
  ): Omit<T, Key>;

  public static exclude<T, Key extends keyof T>(
    results: T[],
    keys: Key[],
  ): Omit<T, Key>[];

  public static exclude<T, Key extends keyof T>(
    result: T | T[],
    keys: Key[],
  ): Omit<T, Key> | Omit<T, Key>[] {
    //Check if result is an array
    if (Array.isArray(result)) {
      //Then map over the array and return a new array with the keys removed
      return result.map((r) => {
        return this.exclude(r, keys);
      });
    } else {
      for (const k of keys) {
        delete result[k];
      }
      return result;
    }
  }
}
