import {
	Location,
	BooleanToken,
	NumberToken,
	StringToken,
	IdentifierToken,
} from "./tokens";

export enum AstNodeType {
	String = "String",
	Number = "Number",
	Boolean = "Boolean",
	Identifier = "Identifier",
	List = "List",
	ListEnd = "ListEnd",
	Attrs = "Attrs",
	AttrsEnd = "AttrsEnd",
	Missing = "Missing",
}

export interface BaseAstNode {
	type: AstNodeType;
	loc: {
		start: Location;
		end: Location;
	};
}

export type NumberAstNode = NumberToken;
export type StringAstNode = StringToken;
export type BooleanAstNode = BooleanToken;
export type IdentifierAstNode = IdentifierToken;

export interface ListAstNode extends BaseAstNode {
	type: AstNodeType.List;
	value: Array<AstNode>;
}

export interface ListEndAstNode extends BaseAstNode {
	type: AstNodeType.ListEnd;
}

export interface AttrsAstNode extends BaseAstNode {
	type: AstNodeType.Attrs;
	value: Array<
		| {
				name: IdentifierAstNode | MissingAstNode;
				value: AstNode;
				loc: {
					start: Location;
					end: Location;
				};
		  }
		| MissingAstNode
	>;
}

export interface AttrsEndAstNode extends BaseAstNode {
	type: AstNodeType.AttrsEnd;
}

export interface MissingAstNode extends BaseAstNode {
	type: AstNodeType.Missing;
	error: string;
}

export type AstNode =
	| NumberAstNode
	| StringAstNode
	| BooleanAstNode
	| ListAstNode
	| ListEndAstNode
	| AttrsAstNode
	| AttrsEndAstNode
	| IdentifierAstNode
	| MissingAstNode;
