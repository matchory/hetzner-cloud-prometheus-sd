export const logLevels = ['debug', 'info', 'warn', 'error', 'none'];
export function setup(logLevel) {
    function shouldLog(level) {
        return logLevels.indexOf(level) >= logLevels.indexOf(logLevel);
    }
    let _console = console;
    global.console = {
        ...global.console,
        info(message, ...optionalParams) {
            shouldLog('info') && _console.log(`INFO\t${message}`, ...optionalParams);
        },
        warn(message, ...optionalParams) {
            shouldLog('warn') && _console.warn(`WARN\t${message}`, ...optionalParams);
        },
        error(message, ...optionalParams) {
            shouldLog('error') && _console.error(`ERROR\t${message}`, ...optionalParams);
        },
        debug(message, ...optionalParams) {
            shouldLog('debug') && _console.debug(`DEBUG\t${message}`, ...optionalParams);
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZy5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbG9nZ2luZy5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFlLENBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBRSxDQUFDO0FBRWxGLE1BQU0sVUFBVSxLQUFLLENBQUUsUUFBa0I7SUFDckMsU0FBUyxTQUFTLENBQUUsS0FBZTtRQUMvQixPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUUsS0FBSyxDQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBRSxRQUFRLENBQUUsQ0FBQztJQUN2RSxDQUFDO0lBRUQsSUFBSSxRQUFRLEdBQUssT0FBTyxDQUFDO0lBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixHQUFHLE1BQU0sQ0FBQyxPQUFPO1FBQ2pCLElBQUksQ0FBRSxPQUFnQixFQUFFLEdBQUcsY0FBcUI7WUFDNUMsU0FBUyxDQUFFLE1BQU0sQ0FBRSxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQy9CLFNBQVUsT0FBUSxFQUFFLEVBQ3BCLEdBQUcsY0FBYyxDQUNwQixDQUFDO1FBQ04sQ0FBQztRQUNELElBQUksQ0FBRSxPQUFnQixFQUFFLEdBQUcsY0FBcUI7WUFDNUMsU0FBUyxDQUFFLE1BQU0sQ0FBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQ2hDLFNBQVUsT0FBUSxFQUFFLEVBQUUsR0FBRyxjQUFjLENBQUUsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsS0FBSyxDQUFFLE9BQWdCLEVBQUUsR0FBRyxjQUFxQjtZQUM3QyxTQUFTLENBQUUsT0FBTyxDQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDbEMsVUFBVyxPQUFRLEVBQUUsRUFDckIsR0FBRyxjQUFjLENBQ3BCLENBQUM7UUFDTixDQUFDO1FBQ0QsS0FBSyxDQUFFLE9BQWdCLEVBQUUsR0FBRyxjQUFxQjtZQUM3QyxTQUFTLENBQUUsT0FBTyxDQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDbEMsVUFBVyxPQUFRLEVBQUUsRUFDckIsR0FBRyxjQUFjLENBQ3BCLENBQUM7UUFDTixDQUFDO0tBQ0osQ0FBQztBQUVOLENBQUMifQ==