import kleur from "kleur";

const help = () => {
	const message = `
${kleur.bold(`DESCRIPTION`)}

    Compile DotBox files to JSON.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`dotbox compile`)} <file> [options]

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --output, -o              Write the resulting JSON to a file

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Compile a file and print the resulting JSON.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox compile`)} ./my.box

    ${kleur.dim(`$ # Compile a file and write the resulting JSON to a file.`)}
    ${kleur.dim(`$`)} ${kleur.bold(
		`dotbox compile`
	)} ./my.box --output ./my.json
`;

	console.log(message);
};

export default help;
