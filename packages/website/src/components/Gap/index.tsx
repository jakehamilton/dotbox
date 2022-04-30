import { JSXInternal } from "preact/src/jsx";

export interface GapProps {
	direction?: "horizontal" | "vertical" | "both";
	size?: number;
}

export default function Gap({ direction = "vertical", size = 1 }: GapProps) {
	const style: JSXInternal.CSSProperties = {};

	if (direction === "vertical" || direction === "both") {
		style.paddingTop = `${size}rem`;
	}
	if (direction === "horizontal" || direction === "both") {
		style.paddingLeft = `${size}rem`;
	}

	return <div style={style} />;
}
