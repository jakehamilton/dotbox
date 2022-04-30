import { Github, Package } from "preact-feather";
import Code from "../../components/Code";
import Gap from "../../components/Gap";
import Logo from "../../components/Logo";
import styles from "./styles.module.css";

const code = `# Format one file
dotbox format ./my.box

# Format multiple files
dotbox format ./my.box ./my_other.box`;

export default function Format() {
	return (
		<div class={styles.Format}>
			<h2 class={styles.FormatTitle}>Format</h2>
			<span class={styles.FormatSubtitle}>
				DotBox comes with a formatter to keep your files clean and
				readable.
			</span>
			<Gap size={1} />
			<Code lang="bash">{code}</Code>
		</div>
	);
}
