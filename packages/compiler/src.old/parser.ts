import {
	AstNode,
	AstNodeType,
	AttrsAstNode,
	AttrsEndAstNode,
	BooleanAstNode,
	IdentifierAstNode,
	ListAstNode,
	ListEndAstNode,
	MissingAstNode,
	NumberAstNode,
	StringAstNode,
} from "./ast";
import Lexer from "./lexer";
import {
	AnyToken,
	IdentifierToken,
	MissingToken,
	Token,
	TokenType,
} from "./tokens";

class Parser {
	lexer = new Lexer();

	missing: Array<MissingToken | MissingAstNode> = [];

	parse(input: string) {
		this.lexer.reset(input);

		const attrs = this.parseRoot();

		return {
			attrs,
			missing: this.missing,
		};
	}

	parseRoot(): AttrsAstNode {
		const attrs: AttrsAstNode = {
			type: AstNodeType.Attrs,
			value: [],
			loc: {
				start: {
					col: 1,
					line: 1,
				},
				end: {
					col: 1,
					line: 1,
				},
			},
		};

		let token: IdentifierToken | MissingToken | undefined;
		// @ts-expect-error
		while ((token = this.lexer.eat(TokenType.Identifier))) {
			if (token === undefined) {
				break;
			}

			if (token.type === TokenType.Missing) {
				this.missing.push(token);
			}

			const eq = this.lexer.eat(TokenType.Equal);

			if (eq === undefined) {
				this.missing.push({
					type: AstNodeType.Missing,
					loc: { start: this.lexer.loc(), end: this.lexer.loc() },
					error: "Expected an = but got end of file.",
				});

				break;
			} else if (eq.type === TokenType.Missing) {
				this.missing.push(eq as MissingToken);
			}

			const value = this.parseExpression();

			attrs.value.push({
				name: token as IdentifierAstNode,
				value,
				loc: {
					start: token.loc.start,
					end: value.loc.end,
				},
			});
		}

		attrs.loc.start = attrs.value[0]?.loc?.start ?? this.lexer.loc();
		attrs.loc.end = this.lexer.loc();

		return attrs;
	}

	parseExpression(): AstNode {
		const token = this.lexer.eat(AnyToken);

		if (token === undefined) {
			return {
				type: AstNodeType.Missing,
				loc: {
					start: this.lexer.loc(),
					end: this.lexer.loc(),
				},
				error: "Expected expression, but got end of file.",
			};
		}

		switch (token.type) {
			case TokenType.Number:
				return token as NumberAstNode;
			case TokenType.String:
				return token as StringAstNode;
			case TokenType.Boolean:
				return token as BooleanAstNode;
			case TokenType.Identifier:
				return token as IdentifierAstNode;
			case TokenType.OpenBracket:
				return this.parseList(token);
			case TokenType.OpenBrace:
				return this.parseAttrs(token);
			case TokenType.CloseBracket:
				return {
					...token,
					type: AstNodeType.ListEnd,
				};
			case TokenType.CloseBrace:
				return {
					...token,
					type: AstNodeType.AttrsEnd,
				};
			default:
				return {
					type: AstNodeType.Missing,
					loc: {
						start: this.lexer.loc(),
						end: this.lexer.loc(),
					},
					error: `Expected expression, but got ${token.type}.`,
				};
		}
	}

	parseList(openBracket: Token): ListAstNode | MissingAstNode {
		const value: Array<AstNode> = [];

		let closeBracket: ListEndAstNode | MissingAstNode;
		while (!this.lexer.eof()) {
			const expression = this.parseExpression();

			if (expression.type === AstNodeType.ListEnd) {
				closeBracket = expression;
				break;
			}

			value.push(expression);
		}

		return {
			type: AstNodeType.List,
			value,
			loc: {
				start: openBracket.loc.start,
				end: closeBracket.loc.end,
			},
		};
	}

	parseAttrs(openBrace: Token): AttrsAstNode {
		const attrs: AttrsAstNode = {
			type: AstNodeType.Attrs,
			value: [],
			loc: {
				start: openBrace.loc.start,
				end: {
					...openBrace.loc.end,
				},
			},
		};

		let token:
			| IdentifierToken
			| AttrsEndAstNode
			| MissingAstNode
			| MissingToken
			| undefined;

		// @ts-expect-error
		while ((token = this.lexer.eat(AnyToken))) {
			if (token === undefined) {
				token = {
					type: AstNodeType.Missing,
					loc: {
						start: this.lexer.loc(),
						end: this.lexer.loc(),
					},
					error: `Expected an identifier or close brace, but got eof.`,
				};
			}

			if (token.type === AstNodeType.AttrsEnd) {
				break;
			} else if (token.type === TokenType.Missing) {
				this.missing.push(token);
			} else if (token.type !== TokenType.Identifier) {
				break;
			}

			const eq = this.lexer.eat(TokenType.Equal);

			if (eq === undefined) {
				this.missing.push({
					type: AstNodeType.Missing,
					loc: { start: this.lexer.loc(), end: this.lexer.loc() },
					error: "Expected an = but got end of file.",
				});

				break;
			} else if (eq.type === TokenType.Missing) {
				this.missing.push(eq as MissingToken);
			}

			const value = this.parseExpression();

			attrs.value.push({
				name: token as IdentifierAstNode,
				value,
				loc: {
					start: token.loc.start,
					end: value.loc.end,
				},
			});
		}

		attrs.loc.end = token?.loc?.end ?? this.lexer.loc();

		return attrs;
	}
}

export default Parser;
