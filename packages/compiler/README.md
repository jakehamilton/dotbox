# @dotbox/compiler

> Compiler infrastructure for DotBox.

## Installation

```bash
# Using npm.
npm install @dotbox/compiler

# Using yarn.
yarn add @dotbox/compiler
```

## Usage

### `compile(input: string)`

The easiest way to use the DotBox compiler is to call the
`compile` function with the text of your `.box` file.

```ts
import { compile } from "@dotbox/compiler";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const { value, error } = compile(text);

if (error) {
	// Handle compilation errors
	for (const err of error) {
		// ...
	}
} else {
	// Use `value` somehow
	console.log(value.my_key.my_number);
}
```

### `class Compiler`

The compiler class can be accessed directly. This can be useful
if you intend to compile multiple files and want to reuse a
compiler instance for each one.

```ts
import { Compiler } from "@dotbox/compiler";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const otherText = `
// This is my _other_ DotBox file.
something? = false
`;

const compiler = new Compiler();

compiler.compile(text);

const firstResult = compiler.result;
const firstErrors = compiler.errors;

compiler.compile(otherText);

const secondResult = compiler.result;
const secondErrors = compiler.errors;
```

### `class Parser`

If you intend to work with an AST representation of a
DotBox file, the `Parser` class can be used.

```ts
import { Parser } from "@dotbox/compiler";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const parser = new Parser(text);

const ast = parser.parse();
const parserErrors = parser.errors;
const lexerErrors = parser.lexer.errors;
```

### `class Lexer`

If you want to work with the raw tokens from a DotBox
file, the `Lexer` class can be used.

```ts
import {
	Lexer,
	AnyToken,
	TokenType,
	Token,
	IdentToken,
	BoolToken,
	MissingToken,
} from "@dotbox/compiler";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const lexer = new Lexer(text);

const firstToken: Token = lexer.lex(AnyToken);
const maybeSecondToken: IdentToken | MissingToken = lexer.tryLex(
	TokenType.Ident
);
const missingToken: BoolToken | MissingToken = lexer.lex(TokenType.Bool);
```

A useful pattern for getting all the tokens of a file is
to loop, waiting for an `EOF` token.

```ts
const tokens: Array<Token> = [];

let token: Token;
while ((token = lexer.lex(AnyToken)) && token.type !== TokenType.EOF) {
	tokens.push(token);
}
```
