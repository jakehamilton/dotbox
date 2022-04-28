import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import Lexer from "../index";
import { AnyToken, Token, TokenType } from "../tokens";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

describe("Lexer", () => {
	it("should work", () => {
		const lexer = new Lexer(read(files.all));

		const tokens = [];

		let token: Token;
		while ((token = lexer.lex(AnyToken)) && token.type !== TokenType.EOF) {
			tokens.push(token);
		}

		console.log(tokens);

		for (const error of lexer.errors) {
			console.error(`${error.message}
	-> ${files.all}:${error.start.line}:${error.start.col}
`);
		}

		expect(lexer.errors.length).toBe(0);
	});
});
