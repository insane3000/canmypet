import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg height="1em" viewBox="0 0 21 21" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 6.5h12" />
      <path d="m4.498 10.5h11.997" />
      <path d="m4.5 14.5h11.995" />
    </g>
  </svg>
);

export default SvgComponent;
