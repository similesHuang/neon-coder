import React from "react";

interface WorkbenchProps {
  isStreaming?: boolean;
  chatStarted?: boolean;
}
export const Workbench: React.FC<WorkbenchProps> = ({
  isStreaming = false,
  chatStarted = false,
}) => {
  return <></>;
};
export default Workbench;
