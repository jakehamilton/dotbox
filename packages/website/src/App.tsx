import styles from "./app.module.css";
import Gap from "./components/Gap";
import Compile from "./sections/Compile";
import Format from "./sections/Format";
import Hero from "./sections/Hero";
import Install from "./sections/Install";

export default function App() {
	return (
		<div class={styles.App}>
			<div class={styles.AppContent}>
				<Hero />
				<Gap />
				<Install />
				<Gap />
				<Format />
				<Gap />
				<Compile />
			</div>
		</div>
	);
}
