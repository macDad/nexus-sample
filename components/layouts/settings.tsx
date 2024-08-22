import { NextPage } from "next";
import { PropsWithChildren } from "react";

export const Settings: NextPage<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};
