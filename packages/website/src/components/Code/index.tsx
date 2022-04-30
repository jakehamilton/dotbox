import Highlight from "react-highlight";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/base16/nord.css";

import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import javascript from "highlight.js/lib/languages/javascript";

import styles from "./styles.module.css";

hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("box", (hljs) => {
	const ATTRIBUTE = {
		className: "attr",
		begin: /[a-zA-Z][a-zA-Z0-9_]*\??(?=\s*=)/,
		relevance: 1.01,
	};

	const PUNCTUATION = {
		match: /[{}[\],\=\-]/,
		className: "punctuation",
		relevance: 0,
	};

	const decimalDigits = "[0-9](_?[0-9])*";
	const frac = `\\.(${decimalDigits})`;
	const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;

	const NUMBER = {
		className: "number",
		variants: [
			// DecimalLiteral
			{
				begin:
					`(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
					`[eE][+-]?(${decimalDigits})\\b`,
			},
			{
				begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b`,
			},

			// DecimalBigIntegerLiteral
			{ begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

			// NonDecimalIntegerLiteral
			{ begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
			{ begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
			{ begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

			// LegacyOctalIntegerLiteral (does not include underscore separators)
			// https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
			{ begin: "\\b0[0-7]+n?\\b" },
		],
		relevance: 0,
	};

	const LITERALS = { beginKeywords: ["true", "false"].join(" ") };

	return {
		name: "box",
		contains: [
			ATTRIBUTE,
			PUNCTUATION,
			LITERALS,
			NUMBER,
			hljs.QUOTE_STRING_MODE,
			hljs.C_LINE_COMMENT_MODE,
			hljs.C_BLOCK_COMMENT_MODE,
		],
		illegal: "\\S",
	};
});

export interface CodeProps {
	lang?: string;
	children: string;
}

export default function Code({ lang = "box", children }: CodeProps) {
	const result = hljs.highlight(children, { language: lang });

	return (
		<pre class={styles.CodeWrapper}>
			<code
				class={`hljs ${lang} ${styles.Code}`}
				dangerouslySetInnerHTML={{ __html: result.value }}
			/>
		</pre>
	);
}
