import { Github, Package } from "preact-feather";
import Code from "../../components/Code";
import Gap from "../../components/Gap";
import Logo from "../../components/Logo";
import styles from "./styles.module.css";

const code = `# Install with NPM
npm install --global @dotbox/cli

# Install with Yarn
yarn add --global @dotbox/cli

# Run directly with NPX
npx @dotbox/cli`;

export default function Install() {
	return (
		<div class={styles.Install}>
			<h2 class={styles.InstallTitle}>Install</h2>
			<span class={styles.InstallSubtitle}>Ready... Set... Done!</span>
			<Gap size={1} />
			<Code lang="bash">{code}</Code>
		</div>
	);
}
