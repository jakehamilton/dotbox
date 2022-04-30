import fs from "fs/promises";
import { compile } from "@dotbox/compiler";

import log from "../../util/log";
import { resolveRelative } from "../../util/path";
import getArgs from "./args";
import help from "./help";

const command = async () => {
	const args = getArgs();

	if (args["--help"]) {
		help();
		process.exit(0);
	}

	if (args._.length === 1) {
		log.fatal("No file specified.");
		process.exit(1);
	}

	if (args._.length > 2) {
		log.fatal("Only one file may be compiled at a time.");
		process.exit(1);
	}

	const file = args._[1];
	const resolved = resolveRelative(file);

	const text = await fs.readFile(resolved, { encoding: "utf-8" });

	const { value, error: errors } = compile(text);

	if (errors) {
		console.log({ errors });
		for (const error of errors) {
			log.error({
				error: error.message,
				file: `${resolved}:${error.start.line}:${error.start.col}`,
			});
		}
		log.fatal("Error compiling file.");
		process.exit(1);
	}

	const json = JSON.stringify(value, null, "\t");

	if (args["--output"]) {
		const output = resolveRelative(args["--output"]);
		log.info(`Writing JSON file "${output}".`);
		await fs.writeFile(output, json);
	} else {
		process.stdout.write(json);
	}
};

export default command;
