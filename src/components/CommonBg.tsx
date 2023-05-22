import { FC, ReactNode } from "react";

export interface CommonBgProps {
  children?: ReactNode;
}

export const CommonBg: FC<CommonBgProps> = ({ children }) => (
  <div className="common-card-bg-box">{children}</div>
);
