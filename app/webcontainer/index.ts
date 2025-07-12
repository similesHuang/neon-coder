import { isClient } from "@/utils";
import { WORK_DIR_NAME } from "@/utils/constant";
import { WebContainer } from "@webcontainer/api";

// 单例webContainer
export const getWebContainerInstance = async (): Promise<WebContainer> => {
  if (!isClient()) {
    throw new Error("WebContainer 只能在客户端使用");
  }
  // 只初始化一次
  if (!window.__webcontainer) {
    window.__webcontainer = await WebContainer.boot({
      workdirName: WORK_DIR_NAME,
    });
  }
  return window.__webcontainer;
};
