import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg height="1em" viewBox="0 0 21 21" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={10.5} cy={10.5} r={8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10.5 11.5v-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={10.5} cy={14.5} fill="currentColor" r={1} />
    </g>
  </svg>
);

export default SvgComponent;
