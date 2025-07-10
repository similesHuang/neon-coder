"use client";

import { useState } from "react";
import NenoChat from "./components/nenoChat";

export default function Home() {
  const [editorVisible, setEditorVisible] = useState(true);

  const renderEditor = () => {
    return <div>编辑器</div>;
  };
  return (
    <div className="flex justify-center flex-1 p-3 gap-4">
      <div className={`${editorVisible ? "flex-1" : ""}`}>
        <NenoChat></NenoChat>
      </div>
      {editorVisible && <div className="flex-3">{renderEditor()}</div>}
    </div>
  );
}
