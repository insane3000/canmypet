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
    >
      <path d="m14.5 9v-6.5" />
      <path d="m14.5 18.5v-4.5" />
      <circle cx={14.5} cy={11.5} r={2.5} />
      <path d="m6.5 5v-2.5" />
      <path d="m6.5 18.5v-8.5" />
      <circle cx={6.5} cy={7.5} r={2.5} />
    </g>
  </svg>
);

export default SvgComponent;
