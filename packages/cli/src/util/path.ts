import path from "path";

export const resolveRelative = (string: string, root = process.cwd()) => {
	if (path.isAbsolute(string)) {
		return string;
	} else {
		return path.resolve(root, string);
	}
};
