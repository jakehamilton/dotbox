import arg from "arg";
import rootArgs from "../../util/args";

const getArgs = () =>
	arg({
		...rootArgs,

		"--output": String,
		"-o": "--output",
	});

export default getArgs;
