import { hrtime } from 'node:process';
/**
 * Measures the execution duration of a callback
 *
 * @param callback Callback to measure
 * @returns A promise containing the duration in milliseconds
 */
export async function measureDuration(callback) {
    const start = hrtime.bigint();
    const result = await callback(start);
    const duration = microSecondsToMilliseconds(hrtime.bigint() - start);
    return [duration, result];
}
export function microSecondsToMilliseconds(microSeconds) {
    return microSeconds / 1000000n;
}
export function groupBy(array, predicate) {
    return array.reduce((acc, value, index, array) => {
        (acc[predicate(value, index, array)] ||= []).push(value);
        return acc;
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsaXRpZXMubXRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdEM7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLGVBQWUsQ0FBZSxRQUFnQztJQUNoRixNQUFNLEtBQUssR0FBTSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakMsTUFBTSxNQUFNLEdBQUssTUFBTSxRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsMEJBQTBCLENBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQzFCLENBQUM7SUFFRixPQUFPLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxNQUFNLFVBQVUsMEJBQTBCLENBQUUsWUFBb0I7SUFDNUQsT0FBTyxZQUFZLEdBQUcsUUFBVSxDQUFDO0FBQ3JDLENBQUM7QUFFRCxNQUFNLFVBQVUsT0FBTyxDQUFLLEtBQVUsRUFBRSxTQUE0RDtJQUNoRyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUUsQ0FBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUcsRUFBRTtRQUNoRCxDQUFFLEdBQUcsQ0FBRSxTQUFTLENBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUUsQ0FBRSxLQUFLLEVBQUUsQ0FBRSxDQUFDLElBQUksQ0FBRSxLQUFLLENBQUUsQ0FBQztRQUNqRSxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUMsRUFBRSxFQUE4QixDQUFFLENBQUM7QUFDeEMsQ0FBQyJ9