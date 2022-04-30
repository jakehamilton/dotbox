import { JSX } from "preact";
import svg from "../../assets/images/dotbox.svg";

export interface LogoProps extends JSX.HTMLAttributes<SVGSVGElement> {}

export default function Logo(props: LogoProps) {
	const { ...svgProps } = props;

	return (
		<svg
			width="512"
			height="512"
			version="1.1"
			viewBox="0 0 135.47 135.47"
			xmlns="http://www.w3.org/2000/svg"
			{...svgProps}
		>
			<g>
				<path
					d="m4.2333 4.2333v127h127v-127zm3.9688 3.9688h119.06v119.06h-119.06z"
					fill="currentColor"
					stroke-width=".26458"
					style="paint-order:markers fill stroke"
				/>
				<g
					transform="translate(-160.48 20.827)"
					fill="currentColor"
					font-family="sans-serif"
					font-size="53.291px"
					stroke-width=".21316"
				>
					<text
						x="186.08618"
						y="66.304619"
						style="line-height:1.25"
						xmlSpace="preserve"
					>
						<tspan
							x="186.08618"
							y="66.304619"
							font-family="'Hack Nerd Font'"
							font-size="53.291px"
							font-weight="bold"
							stroke-width=".21316"
						>
							BOX
						</tspan>
					</text>
					<text
						x="163.44762"
						y="65.966347"
						style="line-height:1.25"
						xmlSpace="preserve"
					>
						<tspan
							x="163.44762"
							y="65.966347"
							font-family="'Hack Nerd Font'"
							font-size="53.291px"
							font-weight="bold"
							stroke-width=".21316"
						>
							.
						</tspan>
					</text>
				</g>
				<text
					x="237.37004"
					y="20.16432"
					fill="currentColor"
					font-family="sans-serif"
					font-size="10.583px"
					stroke-width=".26458"
					style="line-height:1.25"
					xmlSpace="preserve"
				>
					<tspan x="237.37004" y="20.16432" stroke-width=".26458" />
				</text>
			</g>
		</svg>
	);
}
