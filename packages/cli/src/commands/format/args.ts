import arg from "arg";
import rootArgs from "../../util/args";

const getArgs = () =>
	arg({
		...rootArgs,
	});

export default getArgs;
