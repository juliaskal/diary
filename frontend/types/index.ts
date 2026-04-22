import { SVGProps } from "react";

export type { Folder } from "./folder";
export type { Post } from "./post";
export type { PostPage } from "./postPage";
export { Emotion } from "./emotion";
export { Sentiment } from "./sentiment";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
