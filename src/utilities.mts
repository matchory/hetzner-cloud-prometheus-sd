import { hrtime } from 'node:process';

/**
 * Measures the execution duration of a callback
 *
 * @param callback Callback to measure
 * @returns A promise containing the duration in milliseconds
 */
export async function measureDuration<T = unknown>( callback: ( start: bigint ) => T ): Promise<[ bigint, Awaited<T> ]> {
    const start    = hrtime.bigint();
    const result   = await callback( start );
    const duration = microSecondsToMilliseconds(
        hrtime.bigint() - start,
    );

    return [ duration, result ];
}

export function microSecondsToMilliseconds( microSeconds: bigint ): bigint {
    return microSeconds / 1_000_000n;
}

export function groupBy<T>( array: T[], predicate: ( value: T, index: number, array: T[] ) => string ) {
    return array.reduce( ( acc, value, index, array ) => {
        ( acc[ predicate( value, index, array ) ] ||= [] ).push( value );
        return acc;
    }, {} as { [ key: string ]: T[] } );
}

export type CamelCaseKey<K extends PropertyKey> = K extends string
                                                  ? Exclude<CamelCase<K>, ''>
                                                  : K;
export type CamelCase<S extends string> = string extends S
                                          ? string
                                          : S extends `${ infer T }-${ infer U }`
                                            ? `${ T }${ PascalCase<U> }`
                                            : S;
export type PascalCase<S extends string> = string extends S
                                           ? string
                                           : S extends `${ infer T }-${ infer U }`
                                             ? `${ Capitalize<T> }${ PascalCase<U> }`
                                             : Capitalize<S>;
