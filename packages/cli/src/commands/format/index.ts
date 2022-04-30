import fs from "fs/promises";
import { format } from "@dotbox/format";

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

	const files = args._.slice(1);

	if (files.length === 0) {
		log.fatal("No files specified.");
		process.exit(1);
	}

	log.info("Formatting files...");
	for (const file of files) {
		const resolved = resolveRelative(file);
		const text = await fs.readFile(resolved, { encoding: "utf-8" });

		const { value, error: errors } = format(text);

		if (errors) {
			for (const error of errors) {
				log.error({
					error: error.message,
					file: `${resolved}:${error.start.line}:${error.start.col}`,
				});
			}
			log.fatal("Error formatting file.");
			process.exit(1);
		}

		log.trace(`Writing formatted file "${resolved}".`);
		await fs.writeFile(resolved, value);
	}
};

export default command;
