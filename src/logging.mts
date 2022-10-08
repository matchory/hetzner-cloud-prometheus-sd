export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export const logLevels: LogLevel[] = [ 'debug', 'info', 'warn', 'error', 'none' ];

export function setup( logLevel: LogLevel ): void {
    function shouldLog( level: LogLevel ): boolean {
        return logLevels.indexOf( level ) >= logLevels.indexOf( logLevel );
    }

    let _console   = console;
    global.console = {
        ...global.console,
        info( message?: string, ...optionalParams: any[] ): void {
            shouldLog( 'info' ) && _console.log(
                `INFO\t${ message }`,
                ...optionalParams,
            );
        },
        warn( message?: string, ...optionalParams: any[] ): void {
            shouldLog( 'warn' ) && _console.warn(
                `WARN\t${ message }`, ...optionalParams );
        },
        error( message?: string, ...optionalParams: any[] ): void {
            shouldLog( 'error' ) && _console.error(
                `ERROR\t${ message }`,
                ...optionalParams,
            );
        },
        debug( message?: string, ...optionalParams: any[] ): void {
            shouldLog( 'debug' ) && _console.debug(
                `DEBUG\t${ message }`,
                ...optionalParams,
            );
        },
    };

}
