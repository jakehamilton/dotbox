import {
	Token,
	AnyToken,
	TokenType,
	Location,
	WhitespaceToken,
	NumberKind,
	MissingToken,
} from "./tokens";

class Lexer {
	input: string = "";
	cursor: number = 0;
	col: number = 1;
	line: number = 1;

	reset(input = "") {
		this.input = input;
		this.cursor = 0;
		this.col = 1;
		this.line = 1;
	}

	next() {
		this.cursor += 1;
	}

	consume() {
		const current = this.peek();
		this.next();
		return current;
	}

	loc(): Location {
		return {
			col: this.col,
			line: this.line,
		};
	}

	eof() {
		return this.input.length <= this.cursor;
	}

	peek(offset = 0) {
		return this.input[this.cursor + offset];
	}

	eat(type: TokenType | AnyToken): Token | MissingToken | undefined {
		if (this.eof()) {
			return undefined;
		}

		const token = this.lex();

		if (token === undefined) {
			return undefined;
		}

		if (
			token.type === type ||
			token.type === TokenType.Missing ||
			type === AnyToken
		) {
			return token;
		} else {
			return {
				type: TokenType.Missing,
				value: token.value,
				loc: token.loc,
				error: `Unexpected token. Expected ${type} but got ${token.type}.`,
			};
		}
	}

	lex(): Token {
		const whitespace = this.whitespace();

		if (this.eof()) {
			return undefined;
		}

		const firstChar = this.peek();

		if (firstChar === '"') {
			return {
				...this.lexString(),
				whitespace,
			};
		} else if (
			firstChar === "{" ||
			firstChar === "}" ||
			firstChar === "[" ||
			firstChar === "]" ||
			firstChar === "="
		) {
			return {
				...this.lexOperator(firstChar),
				whitespace,
			};
		} else if (firstChar.match(/\d/)) {
			return {
				...this.lexNumber(),
				whitespace,
			};
		} else if (firstChar.match(/[a-zA-Z]/)) {
			return {
				...this.lexIdentifierOrKeyword(),
				whitespace,
			};
		} else {
			const start = this.loc();
			const value = this.consume();
			const end = this.loc();

			return {
				type: TokenType.Missing,
				value: value,
				loc: {
					start,
					end,
				},
			};
		}
	}

	lexString(): Token {
		let output = "";

		const start = this.loc();

		let value = "";

		// Skip starting quote
		this.next();

		while (!this.eof() && this.peek() !== '"') {
			value += this.consume();
		}

		// Skip ending quote
		this.next();

		const end = this.loc();

		return {
			type: TokenType.String,
			loc: { start, end },
			value,
		};
	}

	lexOperator(operator: string): Token {
		let type: TokenType;
		switch (operator) {
			case "{":
				type = TokenType.OpenBrace;
				break;
			case "}":
				type = TokenType.CloseBrace;
				break;
			case "[":
				type = TokenType.OpenBracket;
				break;
			case "]":
				type = TokenType.CloseBracket;
				break;
			case "=":
				type = TokenType.Equal;
				break;
			default:
				type = TokenType.Missing;
				break;
		}

		const start = this.loc();

		const value = this.consume();

		const end = this.loc();

		const error =
			type === TokenType.Missing
				? `Unknown Operator ${value}`
				: undefined;

		if (type === TokenType.Missing) {
			return {
				type,
				value,
				loc: { start, end },
				error,
			};
		} else {
			return {
				type,
				value,
				loc: { start, end },
			};
		}
	}

	lexNumber(): Token {
		const start = this.loc();

		const first = this.consume();

		let kind: NumberKind;

		let value: string = "";

		switch (first + this.peek()) {
			case "0x":
				// Hexadecimal
				this.consume();
				kind = NumberKind.Hex;

				if (this.peek() === "_") {
					break;
				}

				while (!this.eof() && this.peek().match(/[0-9a-fA-F_]/)) {
					value += this.consume();
				}

				break;
			case "0o":
				// Octal
				this.consume();
				kind = NumberKind.Octal;

				if (this.peek() === "_") {
					break;
				}

				while (!this.eof() && this.peek().match(/[0-8_]/)) {
					value += this.consume();
				}

				break;
			case "0b":
				// Binary
				this.consume();
				kind = NumberKind.Binary;

				if (this.peek() === "_") {
					break;
				}

				while (!this.eof() && this.peek().match(/[0-1_]/)) {
					value += this.consume();
				}

				break;
			default:
				kind = NumberKind.Decimal;

				value += first;

				while (!this.eof() && this.peek().match(/[0-9_]/)) {
					value += this.consume();
				}
				break;
		}

		const end = this.loc();

		if (value.length === 0) {
			return {
				type: TokenType.Missing,
				value,
				loc: { start, end },
				error: `Expected a number, but got "${this.peek()}"`,
			};
		} else {
			return {
				type: TokenType.Number,
				kind,
				value,
				loc: { start, end },
			};
		}
	}

	lexIdentifierOrKeyword(): Token {
		const start = this.loc();

		let value = "";

		while (!this.eof() && this.peek().match(/[a-zA-Z_\?\']/)) {
			const char = this.consume();

			value += char;

			if (char.match(/[_\?]/)) {
				break;
			}
		}

		const end = this.loc();

		if (value === "true" || value === "false") {
			return {
				type: TokenType.Boolean,
				value,
				loc: { start, end },
			};
		} else {
			return {
				type: TokenType.Identifier,
				value,
				loc: { start, end },
			};
		}
	}

	whitespace(): WhitespaceToken {
		const start = this.loc();

		let value = "";

		while (!this.eof() && this.peek().match(/\s/)) {
			value += this.input[this.cursor];

			if (this.input[this.cursor] === "\n") {
				this.col = 0;
				this.line++;
			}

			this.cursor++;
		}

		const end = this.loc();

		return {
			type: TokenType.Whitespace,
			value,
			loc: {
				start,
				end,
			},
		};
	}
}

export default Lexer;
