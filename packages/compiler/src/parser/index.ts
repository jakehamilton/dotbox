import Lexer from "../lexer";
import { AnyToken, CommentToken, Token, TokenType } from "../lexer/tokens";
import {
	AttrNode,
	AttrsNode,
	BoolNode,
	CommentNode,
	ExprNode,
	IdentNode,
	ListNode,
	MissingNode,
	NodeLocation,
	NodeType,
	NumberNode,
	PrimitiveNode,
	RootNode,
	StringNode,
	SubExprNode,
} from "./ast";

export interface ParserError {
	message: string;
	start: NodeLocation;
	end: NodeLocation;
}

export default class Parser {
	lexer: Lexer;
	errors: Array<ParserError> = [];

	constructor(text: string) {
		this.lexer = new Lexer(text);
	}

	parse(): RootNode {
		const start = this.lexer.loc();
		const nodes = this.parseAttrNodes();
		const end = this.lexer.loc();

		return {
			type: NodeType.Root,
			nodes,
			start,
			end,
		};
	}

	parseAttrs(): AttrsNode {
		const openBrace = this.lexer.lex(TokenType.OpenBrace);

		const nodes =
			this.lexer.peek().type === TokenType.CloseBrace
				? []
				: this.parseAttrNodes();

		const closeBrace = this.lexer.lex(TokenType.CloseBrace);

		return {
			type: NodeType.Attrs,
			nodes,
			start: openBrace.start,
			end: closeBrace.end,
		};
	}

	parseAttrNodes(): Array<AttrNode | CommentNode> {
		const nodes: Array<AttrNode | CommentNode> = [];

		let token: Token;

		while (
			(token = this.lexer.peek()) &&
			token.type !== TokenType.EOF &&
			token.type !== TokenType.CloseBrace
		) {
			switch (token.type) {
				case TokenType.Ident:
				case TokenType.String:
					nodes.push(this.parseAttr());
					break;
				case TokenType.Comment:
					this.lexer.next();

					nodes.push({
						type: NodeType.Comment,
						kind: token.kind,
						value: token.value,
						start: token.start,
						end: token.end,
					} as unknown as CommentNode);
					break;
				case TokenType.Whitespace:
					this.lexer.next();
					break;
				default:
					this.lexer.next();
					// @TODO(jakehamilton): This should append an error and/or stop parsing attrs
					continue;
			}
		}

		return nodes;
	}

	parseAttr(): AttrNode {
		const preNameComments: Array<CommentNode> = this.parseComments();

		const name = this.parseAttrIdent();

		this.lexer.tryLex(TokenType.Whitespace);

		const postNameComments: Array<CommentNode> = this.parseComments();

		this.lexer.tryLex(TokenType.Whitespace);

		this.lexer.lex(TokenType.Eq);

		this.lexer.tryLex(TokenType.Whitespace);

		const expr: ExprNode = this.parseExpr();

		return {
			type: NodeType.Attr,

			name,
			expr,
			preNameComments,
			postNameComments,

			start: name.start,
			end: expr.end,
		};
	}

	parseAttrIdent(): IdentNode | StringNode | MissingNode {
		const token = this.lexer.peek();

		switch (token.type) {
			case TokenType.String:
				this.lexer.next();
				return {
					type: NodeType.String,
					value: token.value,
					start: token.start,
					end: token.end,
				};
			case TokenType.Ident:
				this.lexer.next();
				return {
					type: NodeType.Ident,
					value: token.value,
					start: token.start,
					end: token.end,
				};
			default:
				return {
					type: NodeType.Missing,
					expected: TokenType.Ident,
					actual: token,
					start: token.start,
					end: token.end,
				};
		}
	}

	parseList(): ListNode {
		const openBracket = this.lexer.lex(TokenType.OpenBracket);

		const value: Array<ExprNode | CommentNode> = [];

		let token: Token;
		while (
			(token = this.lexer.peek()) &&
			token.type !== TokenType.Missing &&
			token.type !== TokenType.EOF &&
			token.type !== TokenType.CloseBracket
		) {
			switch (token.type) {
				case TokenType.Comment:
					value.push(...this.parseComments());
					break;
				case TokenType.Whitespace:
					this.lexer.next();
					break;
				default:
					const expr = this.parseExpr();

					if (expr.value.value.type !== NodeType.Missing) {
						value.push(expr);
					}
					break;
			}
		}

		const closeBracket = this.lexer.lex(TokenType.CloseBracket);

		return {
			type: NodeType.List,
			value,
			start: openBracket.start,
			end: closeBracket.end,
		};
	}

	parseComments(): Array<CommentNode> {
		const comments: Array<CommentNode> = [];

		let token: Token;
		while (
			(token = this.lexer.peek()) &&
			token.type === TokenType.Comment
		) {
			comments.push({
				type: NodeType.Comment,
				kind: token.kind,
				value: token.value,
				start: token.start,
				end: token.end,
			} as unknown as CommentNode);

			this.lexer.next();

			if (this.lexer.peek().type === TokenType.Whitespace) {
				this.lexer.next();
			}
		}

		return comments;
	}

	parseExpr(): ExprNode {
		const preExprComments = this.parseComments();

		const token = this.lexer.peek();

		let value = this.parseSubExpr();

		const whitespaceToken = this.lexer.tryLex(TokenType.Whitespace);

		let postExprComment: CommentNode | undefined;

		if (
			whitespaceToken.type !== TokenType.Missing &&
			!whitespaceToken.value.match(/\n/)
		) {
			const commentToken = this.lexer.tryLex(TokenType.Comment);

			if (commentToken.type !== TokenType.Missing) {
				postExprComment = {
					type: NodeType.Comment,
					kind: commentToken.kind,
					value: commentToken.value,
					start: commentToken.start,
					end: commentToken.end,
				} as unknown as CommentNode;
			}
		}

		return {
			type: NodeType.Expr,
			value,
			preExprComments,
			postExprComment,
			start: value.start,
			end: postExprComment ? postExprComment.end : value.end,
		};
	}

	parseSubExpr(): SubExprNode {
		let value: PrimitiveNode | AttrsNode | ListNode | MissingNode;

		let start: NodeLocation;
		let end: NodeLocation;

		const token = this.lexer.peek();

		switch (token.type) {
			case TokenType.Number:
				value = this.parseNumber();
				start = value.start;
				end = value.end;
				break;
			case TokenType.String:
				value = this.parseString();
				start = value.start;
				end = value.end;
				break;
			case TokenType.Bool:
				value = this.parseBool();
				start = value.start;
				end = value.end;
				break;
			case TokenType.OpenBrace:
				value = this.parseAttrs();
				start = value.start;
				end = value.end;
				break;
			case TokenType.OpenBracket:
				value = this.parseList();
				start = value.start;
				end = value.end;
				break;
			default:
				value = {
					type: NodeType.Missing,
					expected: AnyToken,
					actual: token,
					start: token.start,
					end: token.end,
				};
				start = token.start;
				end = token.end;
				break;
		}

		return {
			type: NodeType.SubExpr,
			value,
			start,
			end,
		};
	}

	parseString(): StringNode | MissingNode {
		const token = this.lexer.lex(TokenType.String);

		if (token.type === TokenType.Missing) {
			return {
				type: NodeType.Missing,
				expected: TokenType.String,
				actual: token,
				start: token.start,
				end: token.end,
			};
		}

		return {
			type: NodeType.String,
			value: token.value,
			start: token.start,
			end: token.end,
		};
	}

	parseNumber(): NumberNode | MissingNode {
		const token = this.lexer.lex(TokenType.Number);

		if (token.type === TokenType.Missing) {
			return {
				type: NodeType.Missing,
				expected: TokenType.Number,
				actual: token,
				start: token.start,
				end: token.end,
			};
		}

		return {
			type: NodeType.Number,
			kind: token.kind,
			value: token.value,
			raw: token.raw,
			isNegative: token.isNegative,
			start: token.start,
			end: token.end,
		} as unknown as NumberNode;
	}

	parseBool(): BoolNode | MissingNode {
		const token = this.lexer.lex(TokenType.Bool);

		if (token.type === TokenType.Missing) {
			return {
				type: NodeType.Missing,
				expected: TokenType.Bool,
				actual: token,
				start: token.start,
				end: token.end,
			};
		}

		return {
			type: NodeType.Bool,
			value: token.value,
			start: token.start,
			end: token.end,
		};
	}
}
