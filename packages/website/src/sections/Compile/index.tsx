import { Github, Package } from "preact-feather";
import Code from "../../components/Code";
import Gap from "../../components/Gap";
import Logo from "../../components/Logo";
import styles from "./styles.module.css";

const code = `# Compile a DotBox file and print the resulting JSON.
dotbox compile ./my.box

# Compile a DotBox file and write the resulting JSON to a file.
dotbox compile ./my.box --output ./my.json`;

export default function Compile() {
	return (
		<div class={styles.Compile}>
			<h2 class={styles.CompileTitle}>Compile</h2>
			<span class={styles.CompileSubtitle}>
				DotBox can compile your files to JSON.
			</span>
			<Gap size={1} />
			<Code lang="bash">{code}</Code>
		</div>
	);
}
