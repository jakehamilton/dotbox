# @dotbox/format

> A formatter for DotBox files.

## Installation

```bash
# Using npm.
npm install @dotbox/format

# Using yarn.
yarn add @dotbox/format
```

## Usage

### `format(text: string)`

To format DotBox code, call the `format` function with the
contents of your `.box` file.

```ts
import { format } from "@dotbox/format";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const { value, error } = format(text);

if (error) {
	// Handle compilation errors
	for (const err of error) {
		// ...
	}
} else {
	// Use `value` (the formatted text) somehow
	console.log("Formatted Text:");
	console.log(value);
}
```

### `class Formatter`

It is typically unnecessary to use the `Formatter` class
directly, but in the event you need it this package exports
the class.

```ts
import { Formatter } from "@dotbox/format";

const text = `
// This is my awesome DotBox file.
my_key = {
	my_number = 1_000
}
`;

const formatter = new Formatter();

const { value, error } = formatter.format(text);

if (error) {
	// Handle compilation errors
	for (const err of error) {
		// ...
	}
} else {
	// Use `value` (the formatted text) somehow
	console.log("Formatted Text:");
	console.log(value);
}

// The Parser and Lexer instances can be accessed on the
// Formatter instance.
const parser = formatter.parser;
const lexer = formatter.lexer;
```
