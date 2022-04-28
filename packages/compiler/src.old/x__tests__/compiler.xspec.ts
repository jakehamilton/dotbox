import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

import Compiler from "../index";

const simple = fs.readFileSync(
	path.resolve(__dirname, "examples", "simple.box"),
	{ encoding: "utf-8" }
);

describe("Compiler", () => {
	it("should compile", () => {
		const compiler = new Compiler();

		const output = compiler.compile(simple);

		if (output.missing) {
			for (const missing of output.missing) {
				console.error(missing);
			}
			throw new Error("Missing tokens");
		}

		console.log(output.value);
	});
});
