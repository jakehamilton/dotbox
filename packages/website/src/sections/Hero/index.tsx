import { Github, Package } from "preact-feather";
import Code from "../../components/Code";
import Gap from "../../components/Gap";
import Logo from "../../components/Logo";
import styles from "./styles.module.css";

const example = `// Say hello to DotBox
key = "value"

multiline_string =
	"
	| Hey there!
	| How's it going?
	"

totally_true = true
definitely_false = false

"any text for your key" = "something"

"
| even multiline
| text can be used
" = "something"

set = {
	decimal = -1_000_000.000_000
	binary = -0b0000_0001
	octal = -0o0123_4567
	hex = -0xdead_beef // Capital letters can be used too!
}

list = [
	1
	true
	"three"
]

bool? = false`;

export default function Hero() {
	return (
		<div class={styles.Hero}>
			{/* <Logo class={styles.HeroLogo} /> */}
			<Gap size={5} />
			<h1 class={styles.HeroTitle}>DotBox</h1>
			<span class={styles.HeroSubtitle}>
				A simple, readable configuration language.
			</span>
			<Gap size={1} />
			<div class={styles.HeroLinks}>
				<a
					class={styles.HeroLink}
					href="https://github.com/jakehamilton/dotbox"
					aria-label="GitHub"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Github class={styles.HeroLinkIcon} />
				</a>
				<a
					class={styles.HeroLink}
					href="https://npm.im/@dotbox/cli"
					aria-label="NPM"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Package class={styles.HeroLinkIcon} />
				</a>
			</div>
			<Code>{example}</Code>
		</div>
	);
}
