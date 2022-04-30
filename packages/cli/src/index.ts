import arg from "arg";
import log from "./util/log";
import rootArgs from "./util/args";
import help from "./util/help";
import commands from "./commands";

const main = async () => {
	log.trace("Init.");
	const args = arg(rootArgs, {
		permissive: true,
	});
	log.trace({ args });

	if (args["--help"] && args._.length === 0) {
		log.trace("Printing root help message.");
		help();
		process.exit(0);
	}

	if (args._.length === 0) {
		log.fatal("No command specified.");
		log.trace("Printing root help message due to error.");
		help();
		process.exit(1);
	}

	const command = args._[0];

	if (command in commands) {
		log.trace(`Executing command "${command}".`);
		await commands[command]();
	} else {
		log.fatal(`Unknown command "${command}".`);
		process.exit(1);
	}
};

main().catch((error) => {
	log.fatal(error.message || error);
	for (const line of error.stack.split("\n").slice(1)) {
		log.fatal(line);
	}

	process.exit(1);
});
