// @flow

export async function genNullable<T>(promise: Promise<T>): Promise<?T> {
  try {
    return await promise;
  } catch (err) {
    return null;
  }
}

export async function genEnforce<T>(promise: Promise<T>): Promise<T> {
  const retVal = await promise;
  if (retVal == null) {
    throw new Error("promise did not return a value to genEnforce");
  }

  return retVal;
}

export async function genWithError<T>(promise: Promise<T>): Promise<[?any, ?any]> {
  try {
    return [null, await promise];
  } catch(err) {
    return [err, null];
  }
}

export function genAllNullable<T>(promises: Array<Promise<T>>): Promise<Array<?T>> {
  return Promise.all(promises.map(genNullable));
}

export function genAllEnforce<T>(promises: Array<Promise<T>>): Promise<Array<T>> {
  return Promise.all(promises.map(genEnforce));
}

export async function genAllWithErrors<T>(promises: Array<Promise<T>>): Promise<[?Array<?Error>, Array<?T>]> {
  const results = await Promise.all(promises.map(genWithError));
  const errors = results.map(result => result[0]).filter(v => v != null);
  const values = results.map(result => result[1]);

  return [errors.length ? errors : null, values];
}
