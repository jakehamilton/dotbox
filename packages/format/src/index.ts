import {
	Lexer,
	Parser,
	Result,
	RootNode,
	LexerError,
	ParserError,
	CommentNode,
	AttrNode,
	NodeType,
	TokenType,
	CommentNodeKind,
	ExprNode,
	IdentNode,
	StringNode,
	NumberNode,
	NumberNodeKind,
	AttrsNode,
	BoolNode,
	ListNode,
} from "@dotbox/compiler";
import LineCoder from "./util/LineCoder";

const sanitizeString = (input: string) => {
	return input.replaceAll('"', '\\"');
};

export class Formatter {
	input: string;
	output: string;
	parser: Parser;
	lexer: Lexer;

	format(text: string): Result<string, Array<LexerError | ParserError>> {
		this.input = text;
		this.parser = new Parser(this.input);
		this.lexer = this.parser.lexer;

		const root = this.parser.parse();

		if (this.lexer.errors.length > 0 || this.parser.errors.length > 0) {
			return {
				value: undefined,
				error: this.lexer.errors.concat(this.parser.errors),
			};
		} else {
			return {
				value: this.formatRoot(root),
				error: undefined,
			};
		}
	}

	formatRoot(root: RootNode): string {
		const coder = new LineCoder();

		this.formatAttrsNodes(coder, root.nodes, [NodeType.Root]);

		return coder.code;
	}

	formatAttrs(coder: LineCoder, attrs: AttrsNode, scope: Array<NodeType>) {
		const subScope = [...scope, NodeType.Attrs];

		if (attrs.nodes.length === 0) {
			coder.line("{ }");
		} else {
			coder.line("{");
			coder.indent();
			this.formatAttrsNodes(coder, attrs.nodes, subScope);

			coder.dedent();
			coder.line("}");
		}
	}

	formatAttrsNodes(
		coder: LineCoder,
		nodes: Array<AttrNode | CommentNode>,
		scope: Array<NodeType>
	) {
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			const next = nodes[i + 1];

			switch (node.type) {
				case NodeType.Attr:
					this.formatAttr(coder, node, scope);
					break;
				case NodeType.Comment:
					this.formatComment(coder, node, scope);
					break;
			}

			if (next && next.start.line - node.end.line > 1) {
				coder.line("");
			}
		}
	}

	formatComment(
		coder: LineCoder,
		node: CommentNode,
		scope: Array<NodeType>,
		inlineHint?: boolean
	) {
		const parent = scope[scope.length - 1];
		const isInline =
			inlineHint !== undefined
				? inlineHint
				: parent === NodeType.Expr ||
				  parent === NodeType.SubExpr ||
				  parent === NodeType.Attr;

		if (node.kind === CommentNodeKind.SingleLine) {
			coder.line(`// ${node.value}`);
		} else {
			const lines = node.value.map((line) => line.replace(/^\t*/, ""));
			if (isInline) {
				let isSingleLine = true;

				let contentLine: string | null = null;
				for (let i = 0; i < lines.length; i++) {
					if (lines[i] && !lines[i].match(/^\s+$/)) {
						if (contentLine !== null) {
							isSingleLine = false;
							break;
						} else {
							contentLine = lines[i];
						}
					}
				}

				if (lines.length === 1) {
					coder.line(`/* ${lines[0]} */`);
				} else if (isSingleLine && contentLine.length < 10) {
					coder.line(`/* ${contentLine.trim()} */`);
				} else {
					coder.line(`/*`);
					coder.indent();
					coder.line(lines[0]);
					for (let i = 1; i < lines.length; i++) {
						const line = lines[i];

						if (
							i !== 1 &&
							i === lines.length - 1 &&
							(line.match(/^\s+$/) || line === "")
						) {
							continue;
						}

						coder.line(`${line}`);
					}
					coder.dedent();
					coder.line(`*/`);
				}
			} else {
				if (lines.length === 1 && lines[0].length < 120) {
					coder.line(`/* ${lines[0]} */`);
				} else {
					coder.line(`/*`);
					coder.indent();
					coder.line(lines[0]);
					for (let i = 1; i < lines.length; i++) {
						const line = lines[i];

						if (
							i !== 1 &&
							i === lines.length - 1 &&
							(line.match(/^\s+$/) || line === "")
						) {
							continue;
						}

						coder.line(`${line}`);
					}
					coder.dedent();
					coder.line(`*/`);
				}
			}
		}
	}

	formatAttr(coder: LineCoder, attr: AttrNode, scope: Array<NodeType>) {
		const subScope = [...scope, NodeType.Attr];

		const nameCoder = new LineCoder();
		const postNameCommentsCoder = new LineCoder();
		const exprCoder = new LineCoder();

		const isExprOnNewLine =
			(attr.expr as ExprNode).value.value.type === NodeType.String &&
			((attr.expr as ExprNode).value.value as StringNode).value.length >
				1 &&
			(attr.expr as ExprNode).preExprComments.length === 0;

		for (const comment of attr.preNameComments) {
			this.formatComment(coder, comment, scope);
		}

		for (const comment of attr.postNameComments) {
			this.formatComment(postNameCommentsCoder, comment, scope);
		}

		switch (attr.name.type) {
			case NodeType.Ident:
				this.formatIdent(nameCoder, attr.name, subScope);
				break;
			case NodeType.String:
				this.formatString(nameCoder, attr.name, subScope);
				break;
		}

		const postNameComment = postNameCommentsCoder.code.trimEnd();

		const isIndented =
			attr.postNameComments.length > 1 ||
			(attr.postNameComments.length === 1 &&
				(attr.postNameComments[0].kind === CommentNodeKind.SingleLine ||
					attr.postNameComments[0].value.length > 1 ||
					attr.postNameComments[0].value[0].length > 40));

		if (isIndented && !isExprOnNewLine) {
			exprCoder.code += "=";
		}

		this.formatExpr(exprCoder, attr.expr as ExprNode, subScope);

		if (isIndented) {
			for (const line of nameCoder.trimEnd()) {
				coder.line(line);
			}
			coder.indent();

			for (const line of postNameCommentsCoder.lines) {
				coder.line(line);
			}

			if (isExprOnNewLine) {
				coder.line("=");
			}
		} else if (isExprOnNewLine) {
			const comment = postNameComment ? ` ${postNameComment}` : "";
			coder.line(`${nameCoder.code.trimEnd()}${comment} =`);
		} else {
			const comment = postNameComment ? ` ${postNameComment}` : "";
			const preExprWhitespace = exprCoder.lines[0] === "" ? "" : " ";
			exprCoder.code = `${nameCoder.code.trimEnd()}${comment} =${preExprWhitespace}${
				exprCoder.code
			}`;
		}

		const isExprIndented =
			(attr.expr as ExprNode).value.value.type === NodeType.String &&
			(attr.expr as ExprNode).preExprComments.length === 0;

		const [firstExprLine, ...exprLines] = exprCoder.trimEnd();

		if (!isIndented && isExprOnNewLine) {
			coder.indent();
		}

		coder.line(firstExprLine);

		if (!isIndented && !isExprOnNewLine && isExprIndented) {
			coder.indent();
		}

		if (exprLines.length > 0) {
			for (const line of exprLines) {
				coder.line(line);
			}
		}

		if (
			!isIndented &&
			(isExprOnNewLine || (!isExprOnNewLine && isExprIndented))
		) {
			coder.dedent();
		}

		if (isIndented) {
			coder.dedent();
		}
	}

	formatIdent(coder: LineCoder, ident: IdentNode, scope: Array<NodeType>) {
		coder.line(ident.value);
	}

	formatString(coder: LineCoder, string: StringNode, scope: Array<NodeType>) {
		if (string.value.length === 1) {
			coder.line(`"${sanitizeString(string.value[0])}"`);
		} else {
			coder.line(`"`);
			for (const line of string.value) {
				coder.line(`| ${sanitizeString(line)}`);
			}
			coder.line(`"`);
		}
	}

	formatExpr(coder: LineCoder, expr: ExprNode, scope: Array<NodeType>) {
		const parent = scope[scope.length - 1];
		const isIndented =
			parent === NodeType.Attr && expr.preExprComments.length > 0;

		if (isIndented) {
			coder.indent();
		}

		if (expr.preExprComments.length > 0) {
			const currentIndent = coder.currentIndent;

			coder.currentIndent = 0;
			coder.line("");
			coder.currentIndent = currentIndent;
		}

		for (const comment of expr.preExprComments) {
			this.formatComment(coder, comment, scope, false);
		}

		const node = expr.value.value;

		const valueCoder = new LineCoder();

		switch (node.type) {
			case NodeType.Number:
				this.formatNumber(valueCoder, node, scope);
				break;
			case NodeType.String:
				this.formatString(valueCoder, node, scope);
				break;
			case NodeType.Bool:
				this.formatBool(valueCoder, node, scope);
				break;
			case NodeType.Attrs:
				this.formatAttrs(valueCoder, node, scope);
				break;
			case NodeType.List:
				this.formatList(valueCoder, node, scope);
				break;
		}

		if (expr.postExprComment) {
			const postExprCommentCoder = new LineCoder();

			this.formatComment(
				postExprCommentCoder,
				expr.postExprComment,
				scope
			);

			const [firstLine, ...rest] = postExprCommentCoder.lines;

			valueCoder.lines[valueCoder.lines.length - 1] = `${
				valueCoder.lines[valueCoder.lines.length - 1]
			} ${firstLine}`;

			valueCoder.importLines(rest);
		}

		coder.importLines(valueCoder.trim());

		if (isIndented) {
			coder.dedent();
		}
	}

	formatNumber(coder: LineCoder, number: NumberNode, scope: Array<NodeType>) {
		const sign = number.isNegative ? "-" : "";
		switch (number.kind) {
			case NumberNodeKind.Decimal:
				coder.line(`${sign}${number.raw}`);
				break;
			case NumberNodeKind.Binary:
				coder.line(`${sign}0b${number.raw}`);
				break;
			case NumberNodeKind.Octal:
				coder.line(`${sign}0o${number.raw}`);
				break;
			case NumberNodeKind.Hex:
				coder.line(`${sign}0x${number.raw}`);
				break;
		}
	}

	formatBool(coder: LineCoder, bool: BoolNode, scope: Array<NodeType>) {
		coder.line(bool.value);
	}

	formatList(coder: LineCoder, list: ListNode, scope: Array<NodeType>) {
		if (list.value.length === 0) {
			coder.line("[ ]");
		} else {
			const subScope = [...scope, NodeType.List];
			coder.line("[");
			coder.indent();

			for (let i = 0; i < list.value.length; i++) {
				const item = list.value[i];
				const next = list.value[i + 1];
				switch (item.type) {
					case NodeType.Expr:
						this.formatExpr(coder, item, subScope);
						break;
					case NodeType.Comment:
						this.formatComment(coder, item, subScope);
						break;
				}

				if (next && next.start.line - item.end.line > 1) {
					coder.line("");
				}
			}

			coder.dedent();
			coder.line("]");
		}
	}
}

export const format = (text: string) => {
	const formatter = new Formatter();

	return formatter.format(text);
};
