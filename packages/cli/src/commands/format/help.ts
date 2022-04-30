import kleur from "kleur";

const help = () => {
	const message = `
${kleur.bold(`DESCRIPTION`)}

    Format DotBox files.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`dotbox format`)} [options] <files>

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Format a single file.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox format`)} ./my.box

    ${kleur.dim(`$ # Format multiple files.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox format`)} ./my.box ./my_other.box
`;

	console.log(message);
};

export default help;
