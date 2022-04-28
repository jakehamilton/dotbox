import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import { Compiler } from "../index";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

describe.only("Lexer", () => {
	it("should work", () => {
		const compiler = new Compiler();

		compiler.compile(read(files.all));

		console.log(JSON.stringify(compiler.result, null, 2));

		for (const error of compiler.errors) {
			console.error(`${error.message}
	-> ${files.all}:${error.start.line}:${error.start.col}
`);
		}

		expect(compiler.errors.length).toBe(0);
	});
});
