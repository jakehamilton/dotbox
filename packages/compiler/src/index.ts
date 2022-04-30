import Lexer, { LexerError } from "./lexer";
import Parser, { ParserError } from "./parser";
import {
	AttrsNode,
	BoolNode,
	ExprNode,
	IdentNode,
	ListNode,
	NodeType,
	NumberNode,
	NumberNodeKind,
	RootNode,
	StringNode,
} from "./parser/ast";
import { Result } from "./util/result";

export * from "./lexer/tokens";
export * from "./parser/ast";

export type { Result } from "./util/result";

export type { LexerError } from "./lexer";
export type { ParserError } from "./parser";

export { Lexer, Parser };

export type JSONValue = string | number | boolean | object | Array<JSONValue>;

export class Compiler {
	lexer: Lexer;
	parser: Parser;

	errors: Array<LexerError | ParserError> = [];
	ast: RootNode | undefined;
	result: object | undefined;

	compile(input: string) {
		this.parser = new Parser(input);
		this.lexer = this.parser.lexer;
		this.ast = undefined;
		this.errors = [];

		this.ast = this.parser.parse();
		this.errors = this.lexer.errors.concat(this.parser.errors);

		if (this.errors.length === 0) {
			const result = this.generate();
			this.result = result;
		}
	}

	generate() {
		const ast = this.ast;

		const root = {};

		for (const node of ast.nodes) {
			switch (node.type) {
				case NodeType.Attr:
					if (
						node.name.type !== NodeType.Missing &&
						node.expr.type !== NodeType.Missing
					) {
						const name = this.generateString(node.name);
						const value = this.generateValue(node.expr);

						if (value !== undefined) {
							root[name] = value;
						}
					}
					break;
			}
		}

		return root;
	}

	generateValue(expr: ExprNode): JSONValue | undefined {
		if (expr.value.value.type === NodeType.Missing) {
			return undefined;
		}

		switch (expr.value.value.type) {
			case NodeType.Number:
				return this.generateNumber(expr.value.value);
			case NodeType.String:
				return this.generateString(expr.value.value);
			case NodeType.Bool:
				return this.generateBool(expr.value.value);
			case NodeType.Attrs:
				return this.generateAttrs(expr.value.value);
			case NodeType.List:
				return this.generateList(expr.value.value);
			default:
				return undefined;
		}
	}

	generateNumber(number: NumberNode): number {
		let result;
		switch (number.kind) {
			default:
			case NumberNodeKind.Decimal:
				result = Number(number.value);
			case NumberNodeKind.Binary:
				result = parseInt(number.value, 2);
			case NumberNodeKind.Octal:
				result = parseInt(number.value, 8);
			case NumberNodeKind.Hex:
				result = parseInt(number.value, 16);
		}

		if (number.isNegative) {
			return result * -1;
		} else {
			return result;
		}
	}

	generateString(string: StringNode | IdentNode): string {
		if (Array.isArray(string.value)) {
			return string.value.join("\n");
		} else {
			return string.value;
		}
	}

	generateBool(bool: BoolNode): boolean {
		switch (bool.value) {
			case "true":
				return true;
			case "false":
				return false;
		}
	}

	generateAttrs(attrs: AttrsNode): Record<string, JSONValue> {
		const result = {};

		for (const node of attrs.nodes) {
			switch (node.type) {
				case NodeType.Attr:
					if (
						node.name.type !== NodeType.Missing &&
						node.expr.type !== NodeType.Missing
					) {
						const name = this.generateString(node.name);
						const value = this.generateValue(node.expr);

						if (value !== undefined) {
							result[name] = value;
						}
					}
					break;
			}
		}

		return result;
	}

	generateList(list: ListNode): Array<JSONValue> {
		const result = [];

		for (const item of list.value) {
			if (
				item.type === NodeType.Expr &&
				item.value.value.type !== NodeType.Missing
			) {
				const value = this.generateValue(item);

				if (value !== undefined) {
					result.push(value);
				}
			}
		}

		return result;
	}
}

export const compile = (
	input: string
): Result<object, Array<LexerError | ParserError>> => {
	const compiler = new Compiler();

	compiler.compile(input);

	if (compiler.errors.length > 0) {
		return { value: undefined, error: compiler.errors };
	} else {
		return { value: compiler.result, error: undefined };
	}
};
