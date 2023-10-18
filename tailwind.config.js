/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			mono: '"IBM Plex Mono", monospace',
			sans: '"Noto Sans", sans-serif',
			display: '"Visby CF", sans-serif',
		},
		colors: {
			chalkboard: {
				10: 'oklch(99.7% 0.008766 102.8deg / <alpha-value>)',
				20: 'oklch(91.34% 0.009353 109deg / <alpha-value>)',
				30: 'oklch(82.99% 0.00994 115.2deg / <alpha-value>)',
				40: 'oklch(74.63% 0.01053 121.4deg / <alpha-value>)',
				50: 'oklch(66.27% 0.01111 127.6deg / <alpha-value>)',
				60: 'oklch(57.92% 0.0117 133.9deg / <alpha-value>)',
				70: 'oklch(49.56% 0.01229 140.1deg / <alpha-value>)',
				80: 'oklch(41.21% 0.01288 146.3deg / <alpha-value>)',
				90: 'oklch(32.85% 0.01346 152.5deg / <alpha-value>)',
				100: 'oklch(24.49% 0.01405 158.7deg / <alpha-value>)',
				110: 'oklch(16.14% 0.01464 164.9deg / <alpha-value>)',
				120: 'oklch(7.783% 0.01522 171.1deg / <alpha-value>)'
			},
			energy: {
				10: 'oklch(93.31% 0.227 122.3deg / <alpha-value>)',
				20: 'oklch(86.01% 0.2092 123.6deg / <alpha-value>)',
				30: 'oklch(78.71% 0.1914 125deg / <alpha-value>)',
				40: 'oklch(71.41% 0.1736 126.3deg / <alpha-value>)',
				50: 'oklch(64.1% 0.1557 127.7deg / <alpha-value>)',
				60: 'oklch(56.8% 0.1379 129.1deg / <alpha-value>)',
				70: 'oklch(49.5% 0.1201 130.4deg / <alpha-value>)',
				80: 'oklch(42.2% 0.1023 131.8deg / <alpha-value>)',
				90: 'oklch(34.9% 0.08446 133.1deg / <alpha-value>)',
				100: 'oklch(27.6% 0.06664 134.5deg / <alpha-value>)',
				110: 'oklch(20.3% 0.04882 135.8deg / <alpha-value>)',
				120: 'oklch(13% 0.031 137.2deg / <alpha-value>)'
			},
			liquid: {
				10: 'oklch(93.45% 0.1002 193.1deg / <alpha-value>)',
				20: 'oklch(86.21% 0.09511 198.7deg / <alpha-value>)',
				30: 'oklch(78.97% 0.09003 204.2deg / <alpha-value>)',
				40: 'oklch(71.74% 0.08495 209.8deg / <alpha-value>)',
				50: 'oklch(64.5% 0.07988 215.3deg / <alpha-value>)',
				60: 'oklch(57.26% 0.0748 220.9deg / <alpha-value>)',
				70: 'oklch(50.03% 0.06972 226.4deg / <alpha-value>)',
				80: 'oklch(42.79% 0.06465 232deg / <alpha-value>)',
				90: 'oklch(35.56% 0.05957 237.5deg / <alpha-value>)',
				100: 'oklch(28.32% 0.0545 243.1deg / <alpha-value>)',
				110: 'oklch(21.08% 0.04942 248.6deg / <alpha-value>)',
				120: 'oklch(13.85% 0.04434 254.2deg / <alpha-value>)'
			},
			fern: {
				10: 'oklch(93.22% 0.1243 144.8deg / <alpha-value>)',
				20: 'oklch(86.59% 0.1193 144.6deg / <alpha-value>)',
				30: 'oklch(79.97% 0.1143 144.4deg / <alpha-value>)',
				40: 'oklch(73.34% 0.1093 144.2deg / <alpha-value>)',
				50: 'oklch(66.71% 0.1043 144deg / <alpha-value>)',
				60: 'oklch(60.09% 0.09927 143.8deg / <alpha-value>)',
				70: 'oklch(53.46% 0.09425 143.6deg / <alpha-value>)',
				80: 'oklch(46.83% 0.08924 143.3deg / <alpha-value>)',
				90: 'oklch(40.21% 0.08422 143.1deg / <alpha-value>)',
				100: 'oklch(33.58% 0.0792 142.9deg / <alpha-value>)',
				110: 'oklch(26.95% 0.07419 142.7deg / <alpha-value>)',
				120: 'oklch(20.33% 0.06917 142.5deg / <alpha-value>)'
			},
			cool: {
				10: 'oklch(97.71% 0.03321 196.6deg / <alpha-value>)',
				20: 'oklch(90.82% 0.03783 203.8deg / <alpha-value>)',
				30: 'oklch(83.94% 0.04245 211deg / <alpha-value>)',
				40: 'oklch(77.06% 0.04706 218.1deg / <alpha-value>)',
				50: 'oklch(70.18% 0.05168 225.3deg / <alpha-value>)',
				60: 'oklch(63.29% 0.0563 232.5deg / <alpha-value>)',
				70: 'oklch(56.41% 0.06091 239.6deg / <alpha-value>)',
				80: 'oklch(49.53% 0.06553 246.8deg / <alpha-value>)',
				90: 'oklch(42.65% 0.07015 254deg / <alpha-value>)',
				100: 'oklch(35.76% 0.07477 261.2deg / <alpha-value>)',
				110: 'oklch(28.88% 0.07938 268.3deg / <alpha-value>)',
				120: 'oklch(22% 0.084 275.5deg / <alpha-value>)'
			},
			river: {
				10: 'oklch(93.35% 0.03169 273.4deg / <alpha-value>)',
				20: 'oklch(86.91% 0.04221 273.1deg / <alpha-value>)',
				30: 'oklch(80.46% 0.05274 272.7deg / <alpha-value>)',
				40: 'oklch(74.01% 0.06326 272.4deg / <alpha-value>)',
				50: 'oklch(67.57% 0.07378 272deg / <alpha-value>)',
				60: 'oklch(61.12% 0.0843 271.7deg / <alpha-value>)',
				70: 'oklch(54.67% 0.09483 271.4deg / <alpha-value>)',
				80: 'oklch(48.22% 0.1053 271deg / <alpha-value>)',
				90: 'oklch(41.78% 0.1159 270.7deg / <alpha-value>)',
				100: 'oklch(35.33% 0.1264 270.4deg / <alpha-value>)',
				110: 'oklch(28.88% 0.1369 270deg / <alpha-value>)',
				120: 'oklch(22.44% 0.1474 269.7deg / <alpha-value>)'
			},
			berry: {
				10: 'oklch(93.77% 0.05212 329deg / <alpha-value>)',
				20: 'oklch(87.3% 0.05912 325.3deg / <alpha-value>)',
				30: 'oklch(80.82% 0.06612 321.6deg / <alpha-value>)',
				40: 'oklch(74.34% 0.07313 317.8deg / <alpha-value>)',
				50: 'oklch(67.86% 0.08013 314.1deg / <alpha-value>)',
				60: 'oklch(61.39% 0.08713 310.3deg / <alpha-value>)',
				70: 'oklch(54.91% 0.09413 306.6deg / <alpha-value>)',
				80: 'oklch(48.43% 0.1011 302.8deg / <alpha-value>)',
				90: 'oklch(41.95% 0.1081 299.1deg / <alpha-value>)',
				100: 'oklch(35.47% 0.1151 295.4deg / <alpha-value>)',
				110: 'oklch(29% 0.1221 291.6deg / <alpha-value>)',
				120: 'oklch(22.52% 0.1291 287.9deg / <alpha-value>)'
			},
			destroy: {
				10: 'oklch(88.21% 0.06281 14.85deg / <alpha-value>)',
				20: 'oklch(83.23% 0.08511 16.91deg / <alpha-value>)',
				30: 'oklch(78.25% 0.1074 18.96deg / <alpha-value>)',
				40: 'oklch(73.27% 0.1297 21.01deg / <alpha-value>)',
				50: 'oklch(68.29% 0.152 23.07deg / <alpha-value>)',
				60: 'oklch(63.31% 0.1743 25.12deg / <alpha-value>)',
				70: 'oklch(58.33% 0.1966 27.18deg / <alpha-value>)',
				80: 'oklch(53.35% 0.2189 29.23deg / <alpha-value>)'
			},
			warn: {
				10: 'oklch(90.19% 0.1361 92deg / <alpha-value>)',
				20: 'oklch(84.6% 0.1388 84.84deg / <alpha-value>)',
				30: 'oklch(79.01% 0.1414 77.68deg / <alpha-value>)',
				40: 'oklch(73.42% 0.144 70.52deg / <alpha-value>)',
				50: 'oklch(67.83% 0.1466 63.36deg / <alpha-value>)',
				60: 'oklch(62.24% 0.1492 56.2deg / <alpha-value>)',
				70: 'oklch(56.65% 0.1518 49.04deg / <alpha-value>)',
				80: 'oklch(51.06% 0.1544 41.88deg / <alpha-value>)'
			},
			succeed: {
				10: 'oklch(89% 0.16 143.4deg / <alpha-value>)',
				20: 'oklch(83.23% 0.1608 143.3deg / <alpha-value>)',
				30: 'oklch(77.46% 0.1616 143.1deg / <alpha-value>)',
				40: 'oklch(71.69% 0.1623 143deg / <alpha-value>)',
				50: 'oklch(65.92% 0.1631 142.9deg / <alpha-value>)',
				60: 'oklch(60.16% 0.1639 142.8deg / <alpha-value>)',
				70: 'oklch(54.39% 0.1647 142.6deg / <alpha-value>)',
				80: 'oklch(48.62% 0.1654 142.5deg / <alpha-value>)'
			}
		}
	},
	plugins: []
};
