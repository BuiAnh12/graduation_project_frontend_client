import Protected from "@/hooks/useProtected";
import React from "react";

const layout = ({ children }) => {
  return <Protected>{children}</Protected>;
};

export default layout;
