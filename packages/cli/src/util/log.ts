import arg from "arg";
import littlelog, {
	configure,
	LogLevel,
	LogLevelAsNumber,
	parseLogLevelNumber,
} from "@littlethings/log";
import rootArgs from "./args";

const args = arg(rootArgs, {
	permissive: true,
});

if (args["--verbose"]) {
	const level =
		args["--verbose"] > 2
			? LogLevel.Trace
			: parseLogLevelNumber(args["--verbose"] as LogLevelAsNumber);

	configure({
		level,
	});
}

export default littlelog.child("DotBox");
