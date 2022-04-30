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

describe("Parser", () => {
	it("should work", () => {
		const parser = new Parser(read(files.all));

		const ast = parser.parse();

		expect(parser.errors.length).toBe(0);
		expect(ast).toMatchSnapshot();
	});

	describe("Numbers", () => {
		it("should parse decimal numbers", () => {
			const parser = new Parser(`x = 1_000`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 10,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 10,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 10,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 10,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 10,
				              "line": 1,
				            },
				            "isNegative": false,
				            "kind": "Decimal",
				            "raw": "1_000",
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Number",
				            "value": "1000",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse binary numbers", () => {
			const parser = new Parser(`x = 0b0000_0010`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 16,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 16,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 16,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 16,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 16,
				              "line": 1,
				            },
				            "isNegative": false,
				            "kind": "Binary",
				            "raw": "0000_0010",
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Number",
				            "value": "00000010",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse octal numbers", () => {
			const parser = new Parser(`x = 0o0123_4567`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 16,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 16,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 16,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 16,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 16,
				              "line": 1,
				            },
				            "isNegative": false,
				            "kind": "Octal",
				            "raw": "0123_4567",
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Number",
				            "value": "01234567",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse hex numbers", () => {
			const parser = new Parser(`x = 0xdead_beef`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 16,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 16,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 16,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 16,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 16,
				              "line": 1,
				            },
				            "isNegative": false,
				            "kind": "Hex",
				            "raw": "dead_beef",
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Number",
				            "value": "deadbeef",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});

	describe("Strings", () => {
		it("should parse single line strings", () => {
			const parser = new Parser(`x = "hello, world"`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 19,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 19,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 19,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 19,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 19,
				              "line": 1,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "String",
				            "value": [
				              "hello, world",
				            ],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse multi line strings", () => {
			const parser = new Parser(`x = "\nhello,\nworld\n"`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 2,
				    "line": 4,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 2,
				        "line": 4,
				      },
				      "expr": {
				        "end": {
				          "col": 2,
				          "line": 4,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 2,
				            "line": 4,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 2,
				              "line": 4,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "String",
				            "value": [
				              "hello,",
				              "world",
				            ],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse multi line strings with indents", () => {
			const parser = new Parser(`x = "
			| hello,
			| world
			"`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 5,
				    "line": 4,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 5,
				        "line": 4,
				      },
				      "expr": {
				        "end": {
				          "col": 5,
				          "line": 4,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 5,
				            "line": 4,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 5,
				              "line": 4,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "String",
				            "value": [
				              "hello,",
				              "world",
				            ],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse strings with escapes", () => {
			const parser = new Parser(`x = "hello\\nworld\\nof\\nstring\\"s"`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 34,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 34,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 34,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 34,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 34,
				              "line": 1,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "String",
				            "value": [
				              "hello",
				              "world",
				              "of",
				              "string\\"s",
				            ],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});

	describe("Bools", () => {
		it("should parse true", () => {
			const parser = new Parser(`x = true`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 9,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 9,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 9,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 9,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 9,
				              "line": 1,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Bool",
				            "value": "true",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse false", () => {
			const parser = new Parser(`x = false`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 10,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 10,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 10,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 10,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 10,
				              "line": 1,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Bool",
				            "value": "false",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});

	describe("Comments", () => {
		it("should parse single line comments", () => {
			const parser = new Parser(`// asdf`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 8,
				    "line": 1,
				  },
				  "nodes": [
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
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse multi line comments", () => {
			const parser = new Parser(`/*
				hello world
			*/`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 3,
				  },
				  "nodes": [
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
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse nested multi line comments", () => {
			const parser = new Parser(`/*
				hello world
				/*
					nested comment

					/*
						doubly nested comment
					*/
				*/
			*/`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 6,
				    "line": 10,
				  },
				  "nodes": [
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
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});

	describe("Attrs", () => {
		it("should parse empty attrs", () => {
			const parser = new Parser(`x = {}`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 7,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 7,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 7,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 7,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 7,
				              "line": 1,
				            },
				            "nodes": [],
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "Attrs",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse attrs", () => {
			const parser = new Parser(`
				x = {
					a = 1
					b = true
					c = "three"
					d = [ "four" ]
					e = { five = true }
				}
			`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 4,
				    "line": 9,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 6,
				        "line": 8,
				      },
				      "expr": {
				        "end": {
				          "col": 6,
				          "line": 8,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 9,
				          "line": 2,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 6,
				            "line": 8,
				          },
				          "start": {
				            "col": 9,
				            "line": 2,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 6,
				              "line": 8,
				            },
				            "nodes": [
				              {
				                "end": {
				                  "col": 11,
				                  "line": 3,
				                },
				                "expr": {
				                  "end": {
				                    "col": 11,
				                    "line": 3,
				                  },
				                  "postExprComment": undefined,
				                  "preExprComments": [],
				                  "start": {
				                    "col": 10,
				                    "line": 3,
				                  },
				                  "type": "Expr",
				                  "value": {
				                    "end": {
				                      "col": 11,
				                      "line": 3,
				                    },
				                    "start": {
				                      "col": 10,
				                      "line": 3,
				                    },
				                    "type": "SubExpr",
				                    "value": {
				                      "end": {
				                        "col": 11,
				                        "line": 3,
				                      },
				                      "isNegative": false,
				                      "kind": "Decimal",
				                      "raw": "1",
				                      "start": {
				                        "col": 10,
				                        "line": 3,
				                      },
				                      "type": "Number",
				                      "value": "1",
				                    },
				                  },
				                },
				                "name": {
				                  "end": {
				                    "col": 7,
				                    "line": 3,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 3,
				                  },
				                  "type": "Ident",
				                  "value": "a",
				                },
				                "postNameComments": [],
				                "preNameComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 3,
				                },
				                "type": "Attr",
				              },
				              {
				                "end": {
				                  "col": 14,
				                  "line": 4,
				                },
				                "expr": {
				                  "end": {
				                    "col": 14,
				                    "line": 4,
				                  },
				                  "postExprComment": undefined,
				                  "preExprComments": [],
				                  "start": {
				                    "col": 10,
				                    "line": 4,
				                  },
				                  "type": "Expr",
				                  "value": {
				                    "end": {
				                      "col": 14,
				                      "line": 4,
				                    },
				                    "start": {
				                      "col": 10,
				                      "line": 4,
				                    },
				                    "type": "SubExpr",
				                    "value": {
				                      "end": {
				                        "col": 14,
				                        "line": 4,
				                      },
				                      "start": {
				                        "col": 10,
				                        "line": 4,
				                      },
				                      "type": "Bool",
				                      "value": "true",
				                    },
				                  },
				                },
				                "name": {
				                  "end": {
				                    "col": 7,
				                    "line": 4,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 4,
				                  },
				                  "type": "Ident",
				                  "value": "b",
				                },
				                "postNameComments": [],
				                "preNameComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 4,
				                },
				                "type": "Attr",
				              },
				              {
				                "end": {
				                  "col": 17,
				                  "line": 5,
				                },
				                "expr": {
				                  "end": {
				                    "col": 17,
				                    "line": 5,
				                  },
				                  "postExprComment": undefined,
				                  "preExprComments": [],
				                  "start": {
				                    "col": 10,
				                    "line": 5,
				                  },
				                  "type": "Expr",
				                  "value": {
				                    "end": {
				                      "col": 17,
				                      "line": 5,
				                    },
				                    "start": {
				                      "col": 10,
				                      "line": 5,
				                    },
				                    "type": "SubExpr",
				                    "value": {
				                      "end": {
				                        "col": 17,
				                        "line": 5,
				                      },
				                      "start": {
				                        "col": 10,
				                        "line": 5,
				                      },
				                      "type": "String",
				                      "value": [
				                        "three",
				                      ],
				                    },
				                  },
				                },
				                "name": {
				                  "end": {
				                    "col": 7,
				                    "line": 5,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 5,
				                  },
				                  "type": "Ident",
				                  "value": "c",
				                },
				                "postNameComments": [],
				                "preNameComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 5,
				                },
				                "type": "Attr",
				              },
				              {
				                "end": {
				                  "col": 20,
				                  "line": 6,
				                },
				                "expr": {
				                  "end": {
				                    "col": 20,
				                    "line": 6,
				                  },
				                  "postExprComment": undefined,
				                  "preExprComments": [],
				                  "start": {
				                    "col": 10,
				                    "line": 6,
				                  },
				                  "type": "Expr",
				                  "value": {
				                    "end": {
				                      "col": 20,
				                      "line": 6,
				                    },
				                    "start": {
				                      "col": 10,
				                      "line": 6,
				                    },
				                    "type": "SubExpr",
				                    "value": {
				                      "end": {
				                        "col": 20,
				                        "line": 6,
				                      },
				                      "start": {
				                        "col": 10,
				                        "line": 6,
				                      },
				                      "type": "List",
				                      "value": [
				                        {
				                          "end": {
				                            "col": 18,
				                            "line": 6,
				                          },
				                          "postExprComment": undefined,
				                          "preExprComments": [],
				                          "start": {
				                            "col": 12,
				                            "line": 6,
				                          },
				                          "type": "Expr",
				                          "value": {
				                            "end": {
				                              "col": 18,
				                              "line": 6,
				                            },
				                            "start": {
				                              "col": 12,
				                              "line": 6,
				                            },
				                            "type": "SubExpr",
				                            "value": {
				                              "end": {
				                                "col": 18,
				                                "line": 6,
				                              },
				                              "start": {
				                                "col": 12,
				                                "line": 6,
				                              },
				                              "type": "String",
				                              "value": [
				                                "four",
				                              ],
				                            },
				                          },
				                        },
				                      ],
				                    },
				                  },
				                },
				                "name": {
				                  "end": {
				                    "col": 7,
				                    "line": 6,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 6,
				                  },
				                  "type": "Ident",
				                  "value": "d",
				                },
				                "postNameComments": [],
				                "preNameComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 6,
				                },
				                "type": "Attr",
				              },
				              {
				                "end": {
				                  "col": 25,
				                  "line": 7,
				                },
				                "expr": {
				                  "end": {
				                    "col": 25,
				                    "line": 7,
				                  },
				                  "postExprComment": undefined,
				                  "preExprComments": [],
				                  "start": {
				                    "col": 10,
				                    "line": 7,
				                  },
				                  "type": "Expr",
				                  "value": {
				                    "end": {
				                      "col": 25,
				                      "line": 7,
				                    },
				                    "start": {
				                      "col": 10,
				                      "line": 7,
				                    },
				                    "type": "SubExpr",
				                    "value": {
				                      "end": {
				                        "col": 25,
				                        "line": 7,
				                      },
				                      "nodes": [
				                        {
				                          "end": {
				                            "col": 23,
				                            "line": 7,
				                          },
				                          "expr": {
				                            "end": {
				                              "col": 23,
				                              "line": 7,
				                            },
				                            "postExprComment": undefined,
				                            "preExprComments": [],
				                            "start": {
				                              "col": 19,
				                              "line": 7,
				                            },
				                            "type": "Expr",
				                            "value": {
				                              "end": {
				                                "col": 23,
				                                "line": 7,
				                              },
				                              "start": {
				                                "col": 19,
				                                "line": 7,
				                              },
				                              "type": "SubExpr",
				                              "value": {
				                                "end": {
				                                  "col": 23,
				                                  "line": 7,
				                                },
				                                "start": {
				                                  "col": 19,
				                                  "line": 7,
				                                },
				                                "type": "Bool",
				                                "value": "true",
				                              },
				                            },
				                          },
				                          "name": {
				                            "end": {
				                              "col": 16,
				                              "line": 7,
				                            },
				                            "start": {
				                              "col": 12,
				                              "line": 7,
				                            },
				                            "type": "Ident",
				                            "value": "five",
				                          },
				                          "postNameComments": [],
				                          "preNameComments": [],
				                          "start": {
				                            "col": 12,
				                            "line": 7,
				                          },
				                          "type": "Attr",
				                        },
				                      ],
				                      "start": {
				                        "col": 10,
				                        "line": 7,
				                      },
				                      "type": "Attrs",
				                    },
				                  },
				                },
				                "name": {
				                  "end": {
				                    "col": 7,
				                    "line": 7,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 7,
				                  },
				                  "type": "Ident",
				                  "value": "e",
				                },
				                "postNameComments": [],
				                "preNameComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 7,
				                },
				                "type": "Attr",
				              },
				            ],
				            "start": {
				              "col": 9,
				              "line": 2,
				            },
				            "type": "Attrs",
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 6,
				          "line": 2,
				        },
				        "start": {
				          "col": 5,
				          "line": 2,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 5,
				        "line": 2,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});

	describe("List", () => {
		it("should parse empty list", () => {
			const parser = new Parser(`x = []`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 7,
				    "line": 1,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 7,
				        "line": 1,
				      },
				      "expr": {
				        "end": {
				          "col": 7,
				          "line": 1,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 5,
				          "line": 1,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 7,
				            "line": 1,
				          },
				          "start": {
				            "col": 5,
				            "line": 1,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 7,
				              "line": 1,
				            },
				            "start": {
				              "col": 5,
				              "line": 1,
				            },
				            "type": "List",
				            "value": [],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 2,
				          "line": 1,
				        },
				        "start": {
				          "col": 1,
				          "line": 1,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 1,
				        "line": 1,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});

		it("should parse close bracket", () => {
			const parser = new Parser(`
				x = [
					1
					true
					"three"
					[ "four" ]
					{ five = true }
				]
			`);

			const ast = parser.parse();

			expect(parser.errors.length).toBe(0);
			expect(ast).toMatchInlineSnapshot(`
				{
				  "end": {
				    "col": 4,
				    "line": 9,
				  },
				  "nodes": [
				    {
				      "end": {
				        "col": 6,
				        "line": 8,
				      },
				      "expr": {
				        "end": {
				          "col": 6,
				          "line": 8,
				        },
				        "postExprComment": undefined,
				        "preExprComments": [],
				        "start": {
				          "col": 9,
				          "line": 2,
				        },
				        "type": "Expr",
				        "value": {
				          "end": {
				            "col": 6,
				            "line": 8,
				          },
				          "start": {
				            "col": 9,
				            "line": 2,
				          },
				          "type": "SubExpr",
				          "value": {
				            "end": {
				              "col": 6,
				              "line": 8,
				            },
				            "start": {
				              "col": 9,
				              "line": 2,
				            },
				            "type": "List",
				            "value": [
				              {
				                "end": {
				                  "col": 7,
				                  "line": 3,
				                },
				                "postExprComment": undefined,
				                "preExprComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 3,
				                },
				                "type": "Expr",
				                "value": {
				                  "end": {
				                    "col": 7,
				                    "line": 3,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 3,
				                  },
				                  "type": "SubExpr",
				                  "value": {
				                    "end": {
				                      "col": 7,
				                      "line": 3,
				                    },
				                    "isNegative": false,
				                    "kind": "Decimal",
				                    "raw": "1",
				                    "start": {
				                      "col": 6,
				                      "line": 3,
				                    },
				                    "type": "Number",
				                    "value": "1",
				                  },
				                },
				              },
				              {
				                "end": {
				                  "col": 10,
				                  "line": 4,
				                },
				                "postExprComment": undefined,
				                "preExprComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 4,
				                },
				                "type": "Expr",
				                "value": {
				                  "end": {
				                    "col": 10,
				                    "line": 4,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 4,
				                  },
				                  "type": "SubExpr",
				                  "value": {
				                    "end": {
				                      "col": 10,
				                      "line": 4,
				                    },
				                    "start": {
				                      "col": 6,
				                      "line": 4,
				                    },
				                    "type": "Bool",
				                    "value": "true",
				                  },
				                },
				              },
				              {
				                "end": {
				                  "col": 13,
				                  "line": 5,
				                },
				                "postExprComment": undefined,
				                "preExprComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 5,
				                },
				                "type": "Expr",
				                "value": {
				                  "end": {
				                    "col": 13,
				                    "line": 5,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 5,
				                  },
				                  "type": "SubExpr",
				                  "value": {
				                    "end": {
				                      "col": 13,
				                      "line": 5,
				                    },
				                    "start": {
				                      "col": 6,
				                      "line": 5,
				                    },
				                    "type": "String",
				                    "value": [
				                      "three",
				                    ],
				                  },
				                },
				              },
				              {
				                "end": {
				                  "col": 16,
				                  "line": 6,
				                },
				                "postExprComment": undefined,
				                "preExprComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 6,
				                },
				                "type": "Expr",
				                "value": {
				                  "end": {
				                    "col": 16,
				                    "line": 6,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 6,
				                  },
				                  "type": "SubExpr",
				                  "value": {
				                    "end": {
				                      "col": 16,
				                      "line": 6,
				                    },
				                    "start": {
				                      "col": 6,
				                      "line": 6,
				                    },
				                    "type": "List",
				                    "value": [
				                      {
				                        "end": {
				                          "col": 14,
				                          "line": 6,
				                        },
				                        "postExprComment": undefined,
				                        "preExprComments": [],
				                        "start": {
				                          "col": 8,
				                          "line": 6,
				                        },
				                        "type": "Expr",
				                        "value": {
				                          "end": {
				                            "col": 14,
				                            "line": 6,
				                          },
				                          "start": {
				                            "col": 8,
				                            "line": 6,
				                          },
				                          "type": "SubExpr",
				                          "value": {
				                            "end": {
				                              "col": 14,
				                              "line": 6,
				                            },
				                            "start": {
				                              "col": 8,
				                              "line": 6,
				                            },
				                            "type": "String",
				                            "value": [
				                              "four",
				                            ],
				                          },
				                        },
				                      },
				                    ],
				                  },
				                },
				              },
				              {
				                "end": {
				                  "col": 21,
				                  "line": 7,
				                },
				                "postExprComment": undefined,
				                "preExprComments": [],
				                "start": {
				                  "col": 6,
				                  "line": 7,
				                },
				                "type": "Expr",
				                "value": {
				                  "end": {
				                    "col": 21,
				                    "line": 7,
				                  },
				                  "start": {
				                    "col": 6,
				                    "line": 7,
				                  },
				                  "type": "SubExpr",
				                  "value": {
				                    "end": {
				                      "col": 21,
				                      "line": 7,
				                    },
				                    "nodes": [
				                      {
				                        "end": {
				                          "col": 19,
				                          "line": 7,
				                        },
				                        "expr": {
				                          "end": {
				                            "col": 19,
				                            "line": 7,
				                          },
				                          "postExprComment": undefined,
				                          "preExprComments": [],
				                          "start": {
				                            "col": 15,
				                            "line": 7,
				                          },
				                          "type": "Expr",
				                          "value": {
				                            "end": {
				                              "col": 19,
				                              "line": 7,
				                            },
				                            "start": {
				                              "col": 15,
				                              "line": 7,
				                            },
				                            "type": "SubExpr",
				                            "value": {
				                              "end": {
				                                "col": 19,
				                                "line": 7,
				                              },
				                              "start": {
				                                "col": 15,
				                                "line": 7,
				                              },
				                              "type": "Bool",
				                              "value": "true",
				                            },
				                          },
				                        },
				                        "name": {
				                          "end": {
				                            "col": 12,
				                            "line": 7,
				                          },
				                          "start": {
				                            "col": 8,
				                            "line": 7,
				                          },
				                          "type": "Ident",
				                          "value": "five",
				                        },
				                        "postNameComments": [],
				                        "preNameComments": [],
				                        "start": {
				                          "col": 8,
				                          "line": 7,
				                        },
				                        "type": "Attr",
				                      },
				                    ],
				                    "start": {
				                      "col": 6,
				                      "line": 7,
				                    },
				                    "type": "Attrs",
				                  },
				                },
				              },
				            ],
				          },
				        },
				      },
				      "name": {
				        "end": {
				          "col": 6,
				          "line": 2,
				        },
				        "start": {
				          "col": 5,
				          "line": 2,
				        },
				        "type": "Ident",
				        "value": "x",
				      },
				      "postNameComments": [],
				      "preNameComments": [],
				      "start": {
				        "col": 5,
				        "line": 2,
				      },
				      "type": "Attr",
				    },
				  ],
				  "start": {
				    "col": 1,
				    "line": 1,
				  },
				  "type": "Root",
				}
			`);
		});
	});
});
