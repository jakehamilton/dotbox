export type AnyToken = "AnyToken";
export const AnyToken: AnyToken = "AnyToken";
export enum TokenType {
	Whitespace = "Whitespace",
	String = "String",
	Number = "Number",
	Boolean = "Boolean",
	Identifier = "Identifier",
	OpenBrace = "OpenBrace",
	CloseBrace = "CloseBrace",
	OpenBracket = "OpenBracket",
	CloseBracket = "CloseBracket",
	Equal = "Equal",
	Missing = "Missing",
}

export interface Location {
	col: number;
	line: number;
}

export interface BaseToken {
	type: TokenType;
	value: string;
	loc: {
		start: Location;
		end: Location;
	};
	whitespace?: WhitespaceToken;
}

export interface WhitespaceToken extends Omit<BaseToken, "whitespace"> {
	type: TokenType.Whitespace;
}

export interface MissingToken extends BaseToken {
	type: TokenType.Missing;
	error?: string;
}

export enum NumberKind {
	Hex,
	Octal,
	Binary,
	Decimal,
}

export interface NumberToken extends BaseToken {
	type: TokenType.Number;
	kind: NumberKind;
}

export interface StringToken extends BaseToken {
	type: TokenType.String;
}

export interface BooleanToken extends BaseToken {
	type: TokenType.Boolean;
}

export interface IdentifierToken extends BaseToken {
	type: TokenType.Identifier;
}

export type Token = BaseToken | MissingToken | NumberToken;
