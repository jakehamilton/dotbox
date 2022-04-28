import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import { Formatter } from "../index";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

describe.only("Formatter", () => {
	it("should work", () => {
		const formatter = new Formatter();

		const { value, error: errors } = formatter.format(read(files.all));

		// console.log(value);

		if (errors) {
			for (const error of errors) {
				console.error(`${error.message}
		-> ${files.all}:${error.start.line}:${error.start.col}
	`);
			}
		}

		expect(errors).toBe(undefined);
	});
});
