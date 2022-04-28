import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import Parser from "../index";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

describe.only("Lexer", () => {
	it("should work", () => {
		const parser = new Parser(read(files.all));

		const ast = parser.parse();

		console.log(JSON.stringify(ast, null, 2));

		for (const error of parser.errors) {
			console.error(`${error.message}
	-> ${files.all}:${error.start.line}:${error.start.col}
`);
		}

		expect(parser.errors.length).toBe(0);
	});
});
