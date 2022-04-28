import { AnyToken, Token, TokenType } from "../lexer/tokens";

export enum NodeType {
	Root = "Root",
	Missing = "Missing",
	Whitespace = "Whitespace",
	Comment = "Comment",
	Attrs = "Attrs",
	Attr = "Attr",
	List = "List",
	Expr = "Expr",
	SubExpr = "SubExpr",
	Primitive = "Primitive",
	Number = "Number",
	String = "String",
	Bool = "Bool",
	Ident = "Ident",
}

export interface NodeLocation {
	col: number;
	line: number;
}

export interface NodeBase {
	start: NodeLocation;
	end: NodeLocation;
}

export interface RootNode extends NodeBase {
	type: NodeType.Root;
	nodes: Array<AttrNode | CommentNode>;
}

export interface MissingNode extends NodeBase {
	type: NodeType.Missing;
	expected: TokenType | NodeType | AnyToken;
	actual: Token | AstNode;
}

export interface WhitespaceNode extends NodeBase {
	type: WhitespaceNode;
	value: string;
}

export enum CommentNodeKind {
	SingleLine = "SingleLine",
	MultiLine = "MultiLine",
}
export interface SingleLineCommentNode extends NodeBase {
	type: NodeType.Comment;
	kind: CommentNodeKind.SingleLine;
	value: string;
}
export interface MultiLineCommentNode extends NodeBase {
	type: NodeType.Comment;
	kind: CommentNodeKind.MultiLine;
	value: Array<string>;
}
export type CommentNode = SingleLineCommentNode | MultiLineCommentNode;

export enum NumberNodeKind {
	Decimal = "Decimal",
	Binary = "Binary",
	Octal = "Octal",
	Hex = "Hex",
}
export interface NumberNode extends NodeBase {
	type: NodeType.Number;
	kind: NumberNodeKind;
	value: string;
	raw: string;
}

export interface StringNode extends NodeBase {
	type: NodeType.String;
	value: Array<string>;
}

export interface BoolNode extends NodeBase {
	type: NodeType.Bool;
	value: string;
}

export type PrimitiveNode = NumberNode | StringNode | BoolNode;

export interface AttrsNode extends NodeBase {
	type: NodeType.Attrs;
	nodes: Array<AttrNode | CommentNode>;
}

export interface AttrNode extends NodeBase {
	type: NodeType.Attr;
	preNameComments: Array<CommentNode>;
	name: IdentNode | StringNode | MissingNode;
	postNameComments: Array<CommentNode>;
	expr: ExprNode | MissingNode;
}

export interface ListNode extends NodeBase {
	type: NodeType.List;
	value: Array<ExprNode | CommentNode>;
}

export interface ExprNode extends NodeBase {
	type: NodeType.Expr;
	preExprComments: Array<CommentNode>;
	value: SubExprNode;
	postExprComment?: CommentNode;
}

export interface SubExprNode extends NodeBase {
	type: NodeType.SubExpr;
	value: PrimitiveNode | AttrsNode | ListNode | MissingNode;
}

export interface IdentNode extends NodeBase {
	type: NodeType.Ident;
	value: string;
}

export type AstNode =
	| RootNode
	| MissingNode
	| WhitespaceNode
	| CommentNode
	| AttrsNode
	| AttrNode
	| ListNode
	| ExprNode
	| PrimitiveNode
	| NumberNode
	| StringNode
	| BoolNode
	| IdentNode;
