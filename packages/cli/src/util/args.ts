import arg from "arg";

const args = {
	"--help": Boolean,
	"-h": "--help",

	"--verbose": arg.COUNT,
	"-v": "--verbose",
} as const;

export default args;
