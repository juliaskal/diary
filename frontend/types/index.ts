import { SVGProps } from "react";

export type { Folder } from "./folder";
export type { Post } from "./post";
export { Emotion } from "./emotion";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
