export const AnyToken = "AnyToken" as const;
export type AnyToken = typeof AnyToken;

export const isAnyToken = (x: any) => {
	return typeof x === "string" && x === AnyToken;
};

export enum TokenType {
	EOF = "EOF",
	Missing = "Missing",
	Whitespace = "Whitespace",
	Comment = "Comment",
	Ident = "Ident",
	Number = "Number",
	String = "String",
	Bool = "Bool",
	OpenBrace = "OpenBrace",
	CloseBrace = "CloseBrace",
	OpenBracket = "OpenBracket",
	CloseBracket = "CloseBracket",
	Eq = "Eq",
}

export interface TokenLocation {
	col: number;
	line: number;
}

export interface TokenBase {
	start: TokenLocation;
	end: TokenLocation;
}

export const CharTokenType = "CharTokenType" as const;
export type CharTokenType = typeof CharTokenType;
export interface CharToken extends TokenBase {
	type: CharTokenType;
	value: string;
}

export const isCharToken = (value: any): value is CharToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === CharTokenType
	);
};

export interface MissingToken extends TokenBase {
	type: TokenType.Missing;
	expected: TokenType | AnyToken;
	actual: Exclude<Token, MissingToken> | CharToken;
}

export const isMissingToken = (value: any): value is MissingToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Missing
	);
};

export interface EOFToken extends TokenBase {
	type: TokenType.EOF;
}

export const isEOFToken = (value: any): value is EOFToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.EOF
	);
};

export interface WhitespaceToken extends TokenBase {
	type: TokenType.Whitespace;
	value: string;
}

export const isWhitespaceToken = (value: any): value is WhitespaceToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Whitespace
	);
};

export enum CommentTokenKind {
	SingleLine = "SingleLine",
	MultiLine = "MultiLine",
}
export interface SingleLineCommentToken extends TokenBase {
	type: TokenType.Comment;
	kind: CommentTokenKind.SingleLine;
	value: string;
}
export interface MultiLineCommentToken extends TokenBase {
	type: TokenType.Comment;
	kind: CommentTokenKind.MultiLine;
	value: Array<string>;
}
export type CommentToken = SingleLineCommentToken | MultiLineCommentToken;

export const isCommentToken = (value: any): value is CommentToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Comment
	);
};

export interface IdentToken extends TokenBase {
	type: TokenType.Ident;
	value: string;
}

export const isIdentToken = (value: any): value is IdentToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Ident
	);
};

export enum NumberTokenKind {
	Decimal = "Decimal",
	Binary = "Binary",
	Octal = "Octal",
	Hex = "Hex",
}
export interface NumberToken extends TokenBase {
	type: TokenType.Number;
	kind: NumberTokenKind;
	value: string;
	raw: string;
	isNegative: boolean;
}

export const isNumberToken = (value: any): value is NumberToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Number
	);
};

export interface StringToken extends TokenBase {
	type: TokenType.String;
	value: Array<string>;
}

export const isStringToken = (value: any): value is StringToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.String
	);
};

export interface BoolToken extends TokenBase {
	type: TokenType.Bool;
	value: string;
}

export const isBoolToken = (value: any): value is BoolToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Bool
	);
};

export interface OpenBraceToken extends TokenBase {
	type: TokenType.OpenBrace;
}

export const isOpenBraceToken = (value: any): value is OpenBraceToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.OpenBrace
	);
};

export interface CloseBraceToken extends TokenBase {
	type: TokenType.CloseBrace;
}

export const isCloseBraceToken = (value: any): value is CloseBraceToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.CloseBrace
	);
};

export interface OpenBracketToken extends TokenBase {
	type: TokenType.OpenBracket;
}

export const isOpenBracketToken = (value: any): value is OpenBracketToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.OpenBracket
	);
};

export interface CloseBracketToken extends TokenBase {
	type: TokenType.CloseBracket;
}

export const isCloseBracketToken = (value: any): value is CloseBracketToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.CloseBracket
	);
};

export interface EqToken extends TokenBase {
	type: TokenType.Eq;
}

export const isEqToken = (value: any): value is EqToken => {
	return (
		value !== null &&
		typeof value === "object" &&
		value.type === TokenType.Eq
	);
};

export type Token =
	| EOFToken
	| MissingToken
	| WhitespaceToken
	| CommentToken
	| IdentToken
	| NumberToken
	| StringToken
	| BoolToken
	| OpenBraceToken
	| CloseBraceToken
	| OpenBracketToken
	| CloseBracketToken
	| EqToken;

// prettier-ignore
export type TokenFromType<Type extends TokenType> =
	Type extends TokenType.EOF
		? EOFToken
	: Type extends TokenType.Missing
		? MissingToken
	: Type extends TokenType.Whitespace
		? WhitespaceToken
	: Type extends TokenType.Comment
		? CommentToken
	: Type extends TokenType.Ident
		? IdentToken
	: Type extends TokenType.Number
		? NumberToken
	: Type extends TokenType.String
		? StringToken
	: Type extends TokenType.Bool
		? BoolToken
	: Type extends TokenType.OpenBrace
		? OpenBraceToken
	: Type extends TokenType.CloseBrace
		? CloseBraceToken
	: Type extends TokenType.OpenBracket
		? OpenBracketToken
	: Type extends TokenType.CloseBracket
		? CloseBracketToken
	: Type extends TokenType.Eq
		? EqToken
	: never;
