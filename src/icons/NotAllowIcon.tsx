import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg height="1em" viewBox="0 0 21 21" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(2 2)"
    >
      <circle cx={8.5} cy={8.5} r={8} />
      <path d="m3 3 11 11" transform="matrix(-1 0 0 1 17 0)" />
    </g>
  </svg>
);

export default SvgComponent;
