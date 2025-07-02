"use client";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useStore } from "@nanostores/react";
import { Popover } from "antd";
import { useState } from "react";
import Asider from "./components/asider";
import { themeStore } from "./store/theme";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const theme = useStore(themeStore);
  const [collapsed, setCollapsed] = useState(false);
  // const getModle = async () => {
  //   const onChunk = (chunk: string) => {
  //     setContent((prev) => prev + chunk);
  //   };
  //   streamRequest({
  //     url: "/api/llm",
  //     body: {
  //       messages: [
  //         {
  //           role: "user",
  //           content: "请介绍一下你自己,你不是deepseek么？",
  //         },
  //       ],
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     onChunk,
  //     onComplete: (fullContent) => {
  //       console.log("Stream completed:", fullContent);
  //     },
  //     onError: (error) => {
  //       console.error("Stream error:", error);
  //     },
  //   });
  // };

  return (
    <div className="p-4">
      <div>
        <Popover content="打开侧边栏">
          <span
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer"
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: "22px" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "22px" }} />
            )}
          </span>
        </Popover>
      </div>
      <Asider open={collapsed} onClose={() => setCollapsed(false)}></Asider>
    </div>
  );
}
