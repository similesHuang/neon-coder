import dark from "@/../public/assets/dark.svg";
import light from "@/../public/assets/light.svg";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Drawer, Popover } from "antd";
import React from "react";
import ThemeMode from "../themeMode";
import HistoryList from "./HistoryList";
export const Asider: React.FC<{
  open?: boolean;
  onClose?: () => void;
}> = ({ onClose, open }) => {
  const footerContent = () => {
    return (
      <ThemeMode
        modes={[
          { key: "light", imgUrl: light },
          { key: "dark", imgUrl: dark },
        ]}
      ></ThemeMode>
    );
  };
  return (
    <Drawer
      open={open}
      width={300}
      placement="left"
      rootStyle={{ outlineColor: "#fff" }}
      styles={{
        body: {
          padding: 16,
        },
      }}
      mask={false}
      closeIcon={null}
      footer={footerContent()}
    >
      <div className="flex flex-col items-centermb-4">
        <div onClick={onClose} className="flex">
          <Popover content="关闭侧边栏">
            <MenuUnfoldOutlined style={{ fontSize: "22px" }} />
          </Popover>
        </div>
        <HistoryList list={[]} />
      </div>
    </Drawer>
  );
};
export default Asider;
