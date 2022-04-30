import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import { Formatter } from "../index";

const examples = path.resolve(__dirname, "examples");

const files = {
	all: path.resolve(examples, "all.box"),
};

const read = (file) => {
	return fs.readFileSync(file, { encoding: "utf-8" });
};

describe("Formatter", () => {
	it("should work", () => {
		const formatter = new Formatter();

		const { value, error } = formatter.format(read(files.all));

		expect(error).toBe(undefined);
		expect(value).toBeDefined();
		expect(typeof value).toBe("string");
	});

	describe("Whitespace", () => {
		it("should place short expressions on one line", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				x = {

				}
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot('"x = { }"');
		});

		it("should place long expressions on multiple line", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				x = { /* a note */ some_key = 42 /* a comment */ some_other_key = "hello, world" /* something important */ }
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"x = {
					/* a note */
					some_key = 42 /* a comment */
					some_other_key = \\"hello, world\\" /* something important */
				}"
			`);
		});

		it("should maintain existing whitespace", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = 1

				b = 2
				c = 3

				d = 4
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = 1

				b = 2
				c = 3

				d = 4"
			`);
		});

		it("should remove excess whitespace", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				// Comment


				a = 1




				b = 2

				c = 3
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"// Comment

				a = 1

				b = 2

				c = 3"
			`);
		});
	});

	describe("Numbers", () => {
		it("should format positive numbers", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = 1_000.000
				b = 0b0000_0000
				c = 0o0123_4567
				d = 0xdead_beef
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = 1_000.000
				b = 0b0000_0000
				c = 0o0123_4567
				d = 0xdead_beef"
			`);
		});

		it("should format negative numbers", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = -1_000.000
				b = -0b0000_0000
				c = -0o0123_4567
				d = -0xdead_beef
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = -1_000.000
				b = -0b0000_0000
				c = -0o0123_4567
				d = -0xdead_beef"
			`);
		});
	});

	describe("Strings", () => {
		it("should format single line strings", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = "hello world"
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot('"a = \\"hello world\\""');
		});

		it("should format multi line strings", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = "
hello
world
"

				b =
					"
					| hello
					| world
					"
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a =
					\\"
					| hello
					| world
					\\"

				b =
					\\"
					| hello
					| world
					\\""
			`);
		});

		it("should convert single line strings to multi line when escaping \\n", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = "hello\nworld"
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a =
					\\"
					| hello
					| world
					\\""
			`);
		});
	});

	describe("Bools", () => {
		it("should format bools", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = true
				b = false
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = true
				b = false"
			`);
		});
	});

	describe("Attrs", () => {
		it("should format empty attrs", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = {

				}
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot('"a = { }"');
		});

		it("should format attrs", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = {
					x = 1

					y = {
						"z" = true

						"
						| hello
						| world
						" = false
					}
				}
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = {
					x = 1
					
					y = {
						\\"z\\" = true
						
						\\"
						| hello
						| world
						\\" = false
					}
				}"
			`);
		});
	});

	describe("Lists", () => {
		it("should format empty lists", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = [

				]
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot('"a = [ ]"');
		});

		it("should format lists", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = ["hello" "world"]

				b = [
					1
					true
					"three"
					[ "sublist" ]
					{ x = "subattrs" }
				]
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = [
					\\"hello\\"
					\\"world\\"
				]

				b = [
					1
					true
					\\"three\\"
					[
						\\"sublist\\"
					]
					{
						x = \\"subattrs\\"
					}
				]"
			`);
		});
	});

	describe("Comments", () => {
		it("should format single line comments", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				// hello
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot('"// hello"');
		});

		it("should format multi line comments", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				/* hello */

				/*
					hello
					world
				*/
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"/* hello */

				/*
					hello
					world
				*/"
			`);
		});

		it("should format post name comments", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a /* hello */ = true

				b // world
					= true
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a /* hello */ = true

				b
					// world
					=
					true"
			`);
		});

		it("should format post expression comments", () => {
			const formatter = new Formatter();

			const { value, error } = formatter.format(`
				a = true // hello

				b = true /*
					hello

				*/

				c = true /*
					hello

					world
				*/
			`);

			expect(error).toBe(undefined);
			expect(value).toMatchInlineSnapshot(`
				"a = true // hello
				
				b = true /* hello */
				
				c = true /*
					hello
					
					world
				*/"
			`);
		});
	});
});
