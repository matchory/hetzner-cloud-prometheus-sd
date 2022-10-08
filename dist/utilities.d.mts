/**
 * Measures the execution duration of a callback
 *
 * @param callback Callback to measure
 * @returns A promise containing the duration in milliseconds
 */
export declare function measureDuration<T = unknown>(callback: (start: bigint) => T): Promise<[bigint, Awaited<T>]>;
export declare function microSecondsToMilliseconds(microSeconds: bigint): bigint;
export declare function groupBy<T>(array: T[], predicate: (value: T, index: number, array: T[]) => string): {
    [key: string]: T[];
};
export declare type CamelCaseKey<K extends PropertyKey> = K extends string ? Exclude<CamelCase<K>, ''> : K;
export declare type CamelCase<S extends string> = string extends S ? string : S extends `${infer T}-${infer U}` ? `${T}${PascalCase<U>}` : S;
export declare type PascalCase<S extends string> = string extends S ? string : S extends `${infer T}-${infer U}` ? `${Capitalize<T>}${PascalCase<U>}` : Capitalize<S>;
