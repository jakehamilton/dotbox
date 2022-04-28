import { AstNodeType } from "./ast";
import Parser from "./parser";
import { NumberKind } from "./tokens";

class Compiler {
	parser = new Parser();
	compile(input: string) {
		const ast = this.parser.parse(input);

		if (ast.missing.length > 0) {
			return {
				missing: ast.missing,
				value: undefined,
			};
		}
		return {
			value: this.compileAttrs(ast.attrs),
			missing: undefined,
		};
	}

	compileAttrs(attrs) {
		const result = {};

		for (const entry of attrs.value) {
			result[entry.name.value] = this.compileExpression(entry.value);
		}

		return result;
	}

	compileList(list) {
		const result = [];

		for (const entry of list.value) {
			result.push(this.compileExpression(entry));
		}

		return result;
	}

	compileNumber(number) {
		switch (number.kind) {
			case NumberKind.Decimal:
				return Number(number.value);
			case NumberKind.Hex:
				return parseInt(number.value, 16);
			case NumberKind.Octal:
				return parseInt(number.value, 8);
			case NumberKind.Binary:
				return parseInt(number.value, 2);
		}
	}

	compileExpression(node) {
		switch (node.type) {
			case AstNodeType.Attrs:
				return this.compileAttrs(node);
			case AstNodeType.List:
				return this.compileList(node);
			case AstNodeType.Number:
				return this.compileNumber(node);
			case AstNodeType.String:
				return node.value;
			case AstNodeType.Boolean:
				return node.value === "true";
		}
	}
}

export default Compiler;
