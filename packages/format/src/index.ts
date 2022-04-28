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
import Coder from "@littlethings/coder";

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
		const coder = new Coder();

		this.formatAttrsNodes(coder, root.nodes, [NodeType.Root]);

		console.log(coder.code);

		return coder.code;
	}

	formatAttrs(coder: Coder, attrs: AttrsNode, scope: Array<NodeType>) {
		const subScope = [...scope, NodeType.Attrs];

		coder.openBlock();
		this.formatAttrsNodes(coder, attrs.nodes, subScope);
		coder.closeBlock();
	}

	formatAttrsNodes(
		coder: Coder,
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
					console.log({
						after: coder.code,
					});
					break;
			}

			console.log(node, next);
			if (next && next.start.line - node.end.line > 1) {
				coder.line("");
			}
		}
	}

	formatComment(
		coder: Coder,
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
				if (lines.length === 1) {
					coder.code += `/* ${lines[0]} */`;
				} else {
					coder.line(`/* ${lines[0]}`);
					coder.indent();
					for (const line of lines.slice(1)) {
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
					for (const line of lines) {
						coder.line(line);
					}
					coder.dedent();
					coder.line(`*/`);
				}
			}
		}
	}

	formatAttr(coder: Coder, attr: AttrNode, scope: Array<NodeType>) {
		const subScope = [...scope, NodeType.Attr];

		const nameCoder = new Coder();
		const postNameCommentsCoder = new Coder();
		const exprCoder = new Coder();

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
			exprCoder.code += "= ";
		}

		this.formatExpr(exprCoder, attr.expr as ExprNode, subScope);

		if (isIndented) {
			for (const line of nameCoder.code.trimEnd().split("\n")) {
				coder.line(line);
			}
			coder.indent();

			for (const line of postNameComment.split("\n")) {
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
			exprCoder.code = `${nameCoder.code.trimEnd()}${comment} = ${
				exprCoder.code
			}`;
		}

		const isExprIndented =
			(attr.expr as ExprNode).value.value.type === NodeType.String &&
			(attr.expr as ExprNode).preExprComments.length === 0;

		const [firstExprLine, ...exprLines] = exprCoder.code
			.trimEnd()
			.split("\n");

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

	formatIdent(coder: Coder, ident: IdentNode, scope: Array<NodeType>) {
		coder.line(ident.value);
	}

	formatString(coder: Coder, string: StringNode, scope: Array<NodeType>) {
		if (string.value.length === 1) {
			coder.line(`"${string.value[0]}"`);
		} else {
			coder.line(`"`);
			for (const line of string.value) {
				coder.line(`| ${line}`);
			}
			coder.line(`"`);
		}
	}

	formatExpr(coder: Coder, expr: ExprNode, scope: Array<NodeType>) {
		const parent = scope[scope.length - 1];
		const isIndented =
			parent === NodeType.Attr && expr.preExprComments.length > 0;

		if (isIndented) {
			coder.indent();
		}

		if (expr.preExprComments.length > 0) {
			coder.line("");
		}

		for (const comment of expr.preExprComments) {
			this.formatComment(coder, comment, scope, false);
		}

		const node = expr.value.value;

		const valueCoder = new Coder();

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
			valueCoder.code = `${valueCoder.code.trimEnd()} `;

			this.formatComment(valueCoder, expr.postExprComment, scope);
		}

		for (const line of valueCoder.code.trim().split("\n")) {
			coder.line(line);
		}

		if (isIndented) {
			coder.dedent();
		}
	}

	formatNumber(coder: Coder, number: NumberNode, scope: Array<NodeType>) {
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

	formatBool(coder: Coder, bool: BoolNode, scope: Array<NodeType>) {
		coder.line(bool.value);
	}

	formatList(coder: Coder, list: ListNode, scope: Array<NodeType>) {
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

export const format = (text: string) => {
	const formatter = new Formatter();

	return formatter.format(text);
};
