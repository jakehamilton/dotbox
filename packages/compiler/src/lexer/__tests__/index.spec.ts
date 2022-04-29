import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import Lexer from "../index";
import { AnyToken, NumberToken, Token, TokenType } from "../tokens";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

const lex = (lexer: Lexer) => {
	const tokens: Array<Token> = [];

	let token: Token;
	while ((token = lexer.lex(AnyToken)) && token.type !== TokenType.EOF) {
		tokens.push(token);
	}

	return tokens;
};

describe("Lexer", () => {
	it("should work", () => {
		const lexer = new Lexer(read(files.all));

		const tokens = [];

		let token: Token;
		while ((token = lexer.lex(AnyToken)) && token.type !== TokenType.EOF) {
			tokens.push(token);
		}

		expect(lexer.errors.length).toBe(0);
	});

	describe("Numbers", () => {
		it("should lex decimal numbers", () => {
			const lexer = new Lexer(`1_000`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 1,
				  },
				  "isNegative": false,
				  "kind": "Decimal",
				  "raw": "1_000",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Number",
				  "value": "1000",
				}
			`);
			expect(Number((tokens[0] as NumberToken).value)).toEqual(1_000);
		});

		it("should lex binary numbers", () => {
			const lexer = new Lexer(`0b0000_0010`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 12,
				    "line": 1,
				  },
				  "isNegative": false,
				  "kind": "Binary",
				  "raw": "0000_0010",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Number",
				  "value": "00000010",
				}
			`);

			expect(parseInt((tokens[0] as NumberToken).value, 2)).toEqual(
				0b0000_0010
			);
		});

		it("should lex octal numbers", () => {
			const lexer = new Lexer(`0o0123_4567`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 12,
				    "line": 1,
				  },
				  "isNegative": false,
				  "kind": "Octal",
				  "raw": "0123_4567",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Number",
				  "value": "01234567",
				}
			`);

			expect(parseInt((tokens[0] as NumberToken).value, 8)).toEqual(
				0o0123_4567
			);
		});

		it("should lex hex numbers", () => {
			const lexer = new Lexer(`0xdead_beef`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 12,
				    "line": 1,
				  },
				  "isNegative": false,
				  "kind": "Hex",
				  "raw": "dead_beef",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Number",
				  "value": "deadbeef",
				}
			`);

			expect(parseInt((tokens[0] as NumberToken).value, 16)).toEqual(
				0xdead_beef
			);
		});
	});

	describe("Strings", () => {
		it("should lex single line strings", () => {
			const lexer = new Lexer(`"hello, world"`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 15,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "String",
				  "value": [
				    "hello, world",
				  ],
				}
			`);
		});

		it("should lex multi line strings", () => {
			const lexer = new Lexer(`"\nhello,\nworld\n"`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 4,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "String",
				  "value": [
				    "hello,",
				    "world",
				  ],
				}
			`);
		});

		it("should lex multi line strings with indents", () => {
			const lexer = new Lexer(`"
			| hello,
			| world
			"`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 5,
				    "line": 4,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "String",
				  "value": [
				    "hello,",
				    "world",
				  ],
				}
			`);
		});

		it("should lex strings with escapes", () => {
			const lexer = new Lexer(`"hello\\nworld\\nof\\nstring\\"s"`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 30,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "String",
				  "value": [
				    "hello",
				    "world",
				    "of",
				    "string\\"s",
				  ],
				}
			`);
		});
	});

	describe("Bools", () => {
		it("should lex true", () => {
			const lexer = new Lexer(`true`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 5,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Bool",
				  "value": "true",
				}
			`);
		});

		it("should lex false", () => {
			const lexer = new Lexer(`false`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Bool",
				  "value": "false",
				}
			`);
		});
	});

	describe("Comments", () => {
		it("should lex single line comments", () => {
			const lexer = new Lexer(`// asdf`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
					{
					  "end": {
					    "col": 8,
					    "line": 1,
					  },
					  "kind": "SingleLine",
					  "start": {
					    "col": 1,
					    "line": 1,
					  },
					  "type": "Comment",
					  "value": "asdf",
					}
				`);
		});

		it("should lex multi line comments", () => {
			const lexer = new Lexer(`/*
				hello world
			*/`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 3,
				  },
				  "kind": "MultiLine",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Comment",
				  "value": [
				    "				hello world",
				    "			",
				  ],
				}
			`);
		});

		it("should lex nested multi line comments", () => {
			const lexer = new Lexer(`/*
				hello world
				/*
					nested comment

					/*
						doubly nested comment
					*/
				*/
			*/`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 10,
				  },
				  "kind": "MultiLine",
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Comment",
				  "value": [
				    "				hello world",
				    "				/*",
				    "					nested comment",
				    "",
				    "					/*",
				    "						doubly nested comment",
				    "					*/",
				    "				*/",
				    "			",
				  ],
				}
			`);
		});
	});

	describe("Attrs", () => {
		it("should lex open brace", () => {
			const lexer = new Lexer(`{`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "OpenBrace",
				}
			`);
		});

		it("should lex close brace", () => {
			const lexer = new Lexer(`}`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "CloseBrace",
				}
			`);
		});
	});

	describe("List", () => {
		it("should lex open bracket", () => {
			const lexer = new Lexer(`[`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "OpenBracket",
				}
			`);
		});

		it("should lex close bracket", () => {
			const lexer = new Lexer(`]`);

			const tokens = lex(lexer);

			expect(lexer.errors.length).toBe(0);
			expect(tokens[0]).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 1,
				  },
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "CloseBracket",
				}
			`);
		});
	});
});
