export interface LineCoderOptions {
	/**
	 * The character to use for indentation.
	 */
	indentChar?: string;
	/**
	 * The number of characters to render for a single indent.
	 * When using tabs, this is typically set to `1`. When
	 * using spaces, this is typically set to `2` or `4`.
	 */
	indentAmount?: number;
}

export default class LineCoder {
	lines = [];
	currentIndent: number = 0;

	indentChar: string = "\t";
	indentAmount: number = 1;

	constructor(options: LineCoderOptions = {}) {
		if (options?.indentChar) {
			this.indentChar = options.indentChar;
		}

		if (options?.indentAmount) {
			this.indentAmount = options.indentAmount;
		}
	}

	get code() {
		return this.lines.join("\n");
	}

	set code(value: string) {
		this.lines = value.split("\n");
	}

	getIndentText() {
		let text = "";

		for (let i = 0; i < this.currentIndent * this.indentAmount; i++) {
			text += this.indentChar;
		}

		return text;
	}

	reset() {
		this.lines = [];
		this.currentIndent = 0;
	}

	line(text?: string) {
		if (text === undefined) {
			this.lines.push("");
		} else {
			this.lines.push(this.getIndentText() + text);
		}
	}

	indent() {
		this.currentIndent++;
	}

	dedent() {
		this.currentIndent--;

		if (this.indentAmount < 0) {
			this.indentAmount = 0;
		}
	}

	openBlock(prefix: string = "") {
		this.line(prefix + " {");
		this.indent();
	}

	closeBlock(suffix: string = "") {
		this.dedent();
		this.line(`}${suffix}`);
	}

	import(coder: LineCoder) {
		for (const line of coder.lines) {
			this.line(line);
		}
	}

	importLines(lines: Array<string>) {
		for (const line of lines) {
			this.line(line);
		}
	}

	trim() {
		return this.trimStart(this.trimEnd());
	}

	trimStart(lines = this.lines) {
		let i;
		for (i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line !== "" && !line.match(/^\s+$/)) {
				break;
			}
		}

		return lines.slice(i, lines.length);
	}

	trimEnd(lines = this.lines) {
		let i;
		for (i = lines.length - 1; i >= 0; i--) {
			const line = lines[i];

			if (line !== "" || !line.match(/^\s+$/)) {
				break;
			}
		}

		return lines.slice(0, i + 1);
	}
}
