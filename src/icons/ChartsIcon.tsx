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
      transform="translate(3 3)"
    >
      <path d="m.5.5v12c0 1.1045695.8954305 2 2 2h11.5" />
      <path d="m3.5 8.5v3" />
      <path d="m7.5 5.5v6" />
      <path d="m11.5 2.5v9" />
    </g>
  </svg>
);

export default SvgComponent;
