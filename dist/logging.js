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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBZSxDQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUUsQ0FBQztBQUVsRixNQUFNLFVBQVUsS0FBSyxDQUFFLFFBQWtCO0lBQ3JDLFNBQVMsU0FBUyxDQUFFLEtBQWU7UUFDL0IsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFFLEtBQUssQ0FBRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUUsUUFBUSxDQUFFLENBQUM7SUFDdkUsQ0FBQztJQUVELElBQUksUUFBUSxHQUFLLE9BQU8sQ0FBQztJQUN6QixNQUFNLENBQUMsT0FBTyxHQUFHO1FBQ2IsR0FBRyxNQUFNLENBQUMsT0FBTztRQUNqQixJQUFJLENBQUUsT0FBZ0IsRUFBRSxHQUFHLGNBQXFCO1lBQzVDLFNBQVMsQ0FBRSxNQUFNLENBQUUsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUMvQixTQUFVLE9BQVEsRUFBRSxFQUNwQixHQUFHLGNBQWMsQ0FDcEIsQ0FBQztRQUNOLENBQUM7UUFDRCxJQUFJLENBQUUsT0FBZ0IsRUFBRSxHQUFHLGNBQXFCO1lBQzVDLFNBQVMsQ0FBRSxNQUFNLENBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUNoQyxTQUFVLE9BQVEsRUFBRSxFQUFFLEdBQUcsY0FBYyxDQUFFLENBQUM7UUFDbEQsQ0FBQztRQUNELEtBQUssQ0FBRSxPQUFnQixFQUFFLEdBQUcsY0FBcUI7WUFDN0MsU0FBUyxDQUFFLE9BQU8sQ0FBRSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQ2xDLFVBQVcsT0FBUSxFQUFFLEVBQ3JCLEdBQUcsY0FBYyxDQUNwQixDQUFDO1FBQ04sQ0FBQztRQUNELEtBQUssQ0FBRSxPQUFnQixFQUFFLEdBQUcsY0FBcUI7WUFDN0MsU0FBUyxDQUFFLE9BQU8sQ0FBRSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQ2xDLFVBQVcsT0FBUSxFQUFFLEVBQ3JCLEdBQUcsY0FBYyxDQUNwQixDQUFDO1FBQ04sQ0FBQztLQUNKLENBQUM7QUFFTixDQUFDIn0=