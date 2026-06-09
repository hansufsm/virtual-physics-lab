import { InlineMath, BlockMath } from "react-katex";

export const M = ({ children }: { children: string }) => (
  <InlineMath math={children} />
);

export const MB = ({ children }: { children: string }) => (
  <div className="my-2 overflow-x-auto">
    <BlockMath math={children} />
  </div>
);