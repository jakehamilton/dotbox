import kleur from "kleur";

const help = () => {
	const message = `
${kleur.bold(`DESCRIPTION`)}

    A tool for compiling and formatting DotBox files.

${kleur.bold(`USAGE`)}

    ${kleur.dim(`$`)} ${kleur.bold(`dotbox`)} <command> [options]

${kleur.bold(`COMMANDS`)}

    fmt, format               Format one or more files
    cmp, compile              Compile a file to JSON

${kleur.bold(`OPTIONS`)}

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity

${kleur.bold(`EXAMPLE`)}

    ${kleur.dim(`$ # Get help for commands.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox format`)} --help
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox compile`)} --help

    ${kleur.dim(`$ # Run DotBox with verbose logging.`)}
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox`)} -v
    ${kleur.dim(`$`)} ${kleur.bold(`dotbox`)} -vv

    ${kleur.dim(`$ # Run DotBox with no logging.`)}
    ${kleur.dim(`$`)} LOG_LEVEL=SILENT ${kleur.bold(`dotbox`)}

    ${kleur.dim(`$ # Run DotBox with timestamps.`)}
    ${kleur.dim(`$`)} LOG_TIMESTAMP=TRUE ${kleur.bold(`dotbox`)}

    ${kleur.dim(`$ # Filter logs from DotBox (based on log prefix).`)}
    ${kleur.dim(`$`)} DEBUG="^some-regex$" ${kleur.bold(`dotbox`)}
`;

	console.log(message);
};

export default help;
