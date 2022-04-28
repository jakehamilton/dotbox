import {
	TokenType,
	AnyToken,
	TokenFromType,
	Token,
	MissingToken,
	isAnyToken,
	TokenLocation,
	WhitespaceToken,
	CommentToken,
	CharTokenType,
	CommentTokenKind,
	StringToken,
	NumberToken,
	NumberTokenKind,
	BoolToken,
	IdentToken,
} from "./tokens";

export interface LexerError {
	message: string;
	start: TokenLocation;
	end: TokenLocation;
}

export default class Lexer {
	cur = 0;
	col = 1;
	line = 1;
	text: string;
	errors: Array<LexerError>;

	constructor(text: string) {
		this.text = text;
		this.errors = [];
	}

	// Utility
	char(offset = 0): string | undefined {
		const cur = this.cur + offset;

		if (this.text.length <= cur) {
			return undefined;
		} else {
			return this.text[this.cur + offset];
		}
	}

	eof(offset = 0) {
		return this.text.length <= this.cur + offset;
	}

	eat() {
		const char = this.char();

		this.cur++;
		if (char === "\n") {
			this.line++;
			this.col = 1;
		} else {
			this.col++;
		}

		return char;
	}

	loc(): TokenLocation {
		return {
			col: this.col,
			line: this.line,
		};
	}

	lookahead<T>(fn: () => T): T {
		const cur = this.cur;
		const col = this.col;
		const line = this.line;
		const errors = this.errors;

		this.errors = [];

		const result = fn();

		this.cur = cur;
		this.col = col;
		this.line = line;
		this.errors = errors;

		return result;
	}

	peek(offset = 0): Token {
		return this.lookahead(() => {
			let token: Token;

			while (offset >= 0) {
				token = this.lex(AnyToken);
				offset--;
			}

			return token;
		});
	}

	next() {
		this.lex(AnyToken);
	}

	// Lexing
	tryLex<Type extends TokenType>(
		type: Type
	): TokenFromType<Type> | MissingToken {
		const token = this.lookahead(() => {
			return this.lex(type);
		});

		if (token.type === type) {
			this.next();
		}

		return token;
	}

	lex<Type extends AnyToken>(type: Type): Token | MissingToken;
	lex<Type extends TokenType>(type: Type): TokenFromType<Type> | MissingToken;
	lex<Type extends TokenType | AnyToken>(type: Type) {
		type Result = Type extends TokenType ? TokenFromType<Type> : Token;

		const token = this.lexAny();

		if (isAnyToken(type)) {
			return token;
		} else {
			if (token.type !== type) {
				this.errors.push({
					message: `Expected ${type} but got ${token.type}`,
					start: token.start,
					end: token.end,
				});

				return {
					type: TokenType.Missing,
					expected: type,
					actual: token,
					start: token.start,
					end: token.end,
				} as MissingToken;
			}

			return token as Result;
		}
	}

	lexAny(): Token {
		if (this.eof()) {
			return {
				type: TokenType.EOF,
				start: this.loc(),
				end: this.loc(),
			};
		}

		const char = this.char();

		if (char.match(/\s/)) {
			return this.lexWhitespace();
		} else if (char === "/") {
			return this.lexComment();
		} else if (char === '"') {
			return this.lexString();
		} else if (char.match(/[\-\d]/)) {
			return this.lexNumber();
		} else if (char === "{") {
			const start = this.loc();
			this.eat();
			const end = this.loc();

			return {
				type: TokenType.OpenBrace,
				start,
				end,
			};
		} else if (char === "}") {
			const start = this.loc();
			this.eat();
			const end = this.loc();

			return {
				type: TokenType.CloseBrace,
				start,
				end,
			};
		} else if (char === "[") {
			const start = this.loc();
			this.eat();
			const end = this.loc();

			return {
				type: TokenType.OpenBracket,
				start,
				end,
			};
		} else if (char === "]") {
			const start = this.loc();
			this.eat();
			const end = this.loc();

			return {
				type: TokenType.CloseBracket,
				start,
				end,
			};
		} else if (char === "=") {
			const start = this.loc();
			this.eat();
			const end = this.loc();

			return {
				type: TokenType.Eq,
				start,
				end,
			};
		} else if (char.match(/[a-zA-Z]/)) {
			return this.lexIdentOrKeyword();
		} else {
			const start = this.loc();

			this.eat();

			const end = this.loc();

			return {
				type: TokenType.Missing,
				expected: AnyToken,
				actual: {
					type: CharTokenType,
					value: char,
					start,
					end,
				},
				start,
				end,
			};
		}
	}

	lexWhitespace(): WhitespaceToken {
		let text = "";

		const start = this.loc();

		while (!this.eof() && this.char().match(/\s/)) {
			text += this.eat();
		}

		return {
			type: TokenType.Whitespace,
			value: text,
			start,
			end: this.loc(),
		};
	}

	lexComment(): CommentToken | MissingToken {
		const start = this.loc();

		// Skip starting slash
		this.eat();

		// End of file... that's not right...
		if (this.eof()) {
			const end = this.loc();

			this.errors.push({
				message: "Expected a comment marker but got end of file.",
				start: end,
				end,
			});

			return {
				type: TokenType.Missing,
				expected: TokenType.Comment,
				actual: {
					type: TokenType.EOF,
					start: end,
					end,
				},
				start,
				end,
			};
		}

		const secondChar = this.char();

		if (secondChar === "/") {
			// single line
			this.eat();

			let text = "";

			// Skip an initial space after comment start
			if (this.char() === " ") {
				this.eat();
			}

			while (!this.eof() && this.char() !== "\n") {
				text += this.eat();
			}

			return {
				type: TokenType.Comment,
				kind: CommentTokenKind.SingleLine,
				value: text,
				start,
				end: this.loc(),
			};
		} else if (secondChar === "*") {
			// multi line
			this.eat();

			let line = "";
			let lines: Array<string> = [];
			let depth = 0;

			// Skip an initial space after comment start
			if (this.char() === " ") {
				this.eat();
			}

			while (!this.eof()) {
				if (
					!this.eof(1) &&
					this.char() === "*" &&
					this.char(1) === "/"
				) {
					depth -= 1;

					if (depth < 0) {
						break;
					}
				}

				if (
					!this.eof(1) &&
					this.char() === "/" &&
					this.char(1) === "*"
				) {
					depth++;
				}

				if (this.char() === "\n") {
					this.eat();
					lines.push(line);
					line = "";
				} else {
					line += this.eat();
				}
			}

			if (line.length > 0 || lines.length === 0) {
				lines.push(line);
			}

			// Skip space before closing star and slash
			const lastLine = lines[lines.length - 1];
			if (
				lastLine !== "" &&
				!lastLine.match(/^\s+$/) &&
				lastLine[lastLine.length - 1] === " "
			) {
				lines[lines.length - 1] = lastLine.substring(
					0,
					lastLine.length - 1
				);
			}

			// Skip closing star and slash
			if (!this.eof()) {
				this.eat();
			}
			if (!this.eof()) {
				this.eat();
			}

			return {
				type: TokenType.Comment,
				kind: CommentTokenKind.MultiLine,
				value: lines,
				start,
				end: this.loc(),
			};
		} else {
			// invalid
			const end = this.loc();

			return {
				type: TokenType.Missing,
				expected: TokenType.Comment,
				actual: {
					type: CharTokenType,
					value: secondChar,
					start,
					end,
				},
				start,
				end,
			};
		}
	}

	lexString(): StringToken {
		const start = this.loc();

		// Skip starting quote
		this.eat();

		let line = "";
		let lines = [];

		let isIndentedMultiLine = false;
		let formattedLine = -1;

		while (!this.eof() && this.char() !== '"') {
			if (this.char() === "\n") {
				lines.push(line);
				line = "";
				this.eat();
			} else if (this.char() === "|" && line.match(/^\s+$/)) {
				line = "";
				isIndentedMultiLine = true;
				formattedLine = lines.length - 1;

				this.eat();
				// Skip a following space if it exists
				if (!this.eof() && this.char() === " ") {
					this.eat();
				}
			} else if (this.char() === "\\") {
				// Skip the backslash
				this.eat();
				// Append whatever comes after (if it exists)
				if (!this.eof()) {
					line += this.eat();
				}
			} else {
				line += this.eat();
			}
		}

		if (
			(!isIndentedMultiLine && line.length > 0) ||
			(isIndentedMultiLine &&
				formattedLine !== lines.length &&
				line.length > 0 &&
				!line.match(/^\s+$/))
		) {
			lines.push(line);
		}

		if (
			isIndentedMultiLine &&
			lines.length > 1 &&
			lines[lines.length - 1] === ""
		) {
			lines = lines.slice(0, lines.length - 1);
		}

		if (isIndentedMultiLine && lines.length > 0 && lines[0] === "") {
			lines = lines.slice(1);
		}

		// Skip closing quote
		if (!this.eof()) {
			this.eat();
		} else {
			this.errors.push({
				message: "Expected a closing quote, but got end of file.",
				start: this.loc(),
				end: this.loc(),
			});
		}

		return {
			type: TokenType.String,
			value: lines,
			start,
			end: this.loc(),
		};
	}

	lexNumber(): NumberToken | MissingToken {
		const start = this.loc();

		let isNegative = false;

		if (this.char() === "-") {
			isNegative = true;
			this.eat();

			if (!this.char().match(/[0-9]/)) {
				const end = this.loc();

				return {
					type: TokenType.Missing,
					expected: TokenType.Number,
					actual: {
						type: CharTokenType,
						value: this.char(),
						start,
						end,
					},
					start,
					end,
				};
			}
		}

		const firstChar = this.char();
		const secondChar = this.char(1);

		let kind: NumberTokenKind;
		let value = "";
		let raw = "";

		if (
			firstChar === "0" &&
			(secondChar === "b" || secondChar === "o" || secondChar === "x")
		) {
			// Skip the first two chars since we know what they are
			this.eat();
			this.eat();

			if (this.eof()) {
				this.errors.push({
					message: "Expected a number but got end of file.",
					start,
					end: this.loc(),
				});

				return {
					type: TokenType.Number,
					kind: NumberTokenKind.Decimal,
					value: "0",
					raw: "0",
					isNegative,
					start,
					end: this.loc(),
				};
			}

			switch (secondChar) {
				case "b":
					kind = NumberTokenKind.Binary;

					if (!this.char().match(/[0-1]/)) {
						this.errors.push({
							message: `Expected a binary literal but got "${this.char()}".`,
							start,
							end: this.loc(),
						});

						return {
							type: TokenType.Number,
							kind: NumberTokenKind.Binary,
							value: "0",
							raw: "0",
							isNegative,
							start,
							end: this.loc(),
						};
					}

					while (!this.eof() && this.char().match(/[0-1_]/)) {
						const char = this.eat();
						if (char === "_" && this.char(-2) === "_") {
							this.errors.push({
								message:
									"Multiple underscores in number literals are not allowed.",
								start: this.loc(),
								end: this.loc(),
							});
						}

						raw += char;

						if (char !== "_") {
							value += char;
						}
					}
					break;
				case "o":
					kind = NumberTokenKind.Octal;

					if (!this.char().match(/[0-7]/)) {
						this.errors.push({
							message: `Expected an octal literal but got "${this.char()}".`,
							start,
							end: this.loc(),
						});

						return {
							type: TokenType.Number,
							kind: NumberTokenKind.Octal,
							value: "0",
							raw: "0",
							isNegative,
							start,
							end: this.loc(),
						};
					}

					while (!this.eof() && this.char().match(/[0-7_]/)) {
						const char = this.eat();
						if (char === "_" && this.char(-2) === "_") {
							this.errors.push({
								message:
									"Multiple underscores in number literals are not allowed.",
								start: this.loc(),
								end: this.loc(),
							});
						}

						raw += char;

						if (char !== "_") {
							value += char;
						}
					}
					break;
				case "x":
					kind = NumberTokenKind.Hex;

					if (!this.char().match(/[0-9a-fA-F]/)) {
						this.errors.push({
							message: `Expected a hex literal but got "${this.char()}".`,
							start,
							end: this.loc(),
						});

						return {
							type: TokenType.Number,
							kind: NumberTokenKind.Hex,
							value: "0",
							raw: "0",
							isNegative,
							start,
							end: this.loc(),
						};
					}

					while (!this.eof() && this.char().match(/[0-9a-fA-F_]/)) {
						const char = this.eat();
						if (char === "_" && this.char(-2) === "_") {
							this.errors.push({
								message:
									"Multiple underscores in number literals are not allowed.",
								start: this.loc(),
								end: this.loc(),
							});
						}

						raw += char;

						if (char !== "_") {
							value += char;
						}
					}
					break;
			}
		} else {
			kind = NumberTokenKind.Decimal;

			let hasDecimal = false;

			while (!this.eof() && this.char().match(/[0-9_\.]/)) {
				if (this.char() === "." && hasDecimal) {
					this.errors.push({
						message:
							"Decimal numbers may not have more than one decimal point.",
						start,
						end: this.loc(),
					});

					break;
				}

				const char = this.eat();

				if (char === "_" && this.char(-2) === "_") {
					this.errors.push({
						message:
							"Multiple underscores in number literals are not allowed.",
						start: this.loc(),
						end: this.loc(),
					});
				}

				raw += char;

				if (char !== "_") {
					value += char;
				}
			}
		}

		if (raw.length > 0 && raw[raw.length - 1] === "_") {
			this.errors.push({
				message: "Numbers may not end with an underscore.",
				start: this.loc(),
				end: this.loc(),
			});
		}

		return {
			type: TokenType.Number,
			kind,
			value,
			raw,
			isNegative,
			start,
			end: this.loc(),
		};
	}

	lexIdentOrKeyword(): IdentToken | BoolToken {
		const start = this.loc();

		let text = "";

		while (!this.eof() && this.char().match(/[a-zA-Z_]/)) {
			text += this.eat();
		}

		if (this.char() === "?") {
			text += this.eat();
		}

		if (text === "true" || text === "false") {
			return {
				type: TokenType.Bool,
				value: text,
				start,
				end: this.loc(),
			};
		} else {
			return {
				type: TokenType.Ident,
				value: text,
				start,
				end: this.loc(),
			};
		}
	}
}
