"use client";

import { getAll, openDB } from "@/dao";
import { ChatHistoryItem } from "@/types/common";
import { isClient } from "@/utils";
import { useEffect, useState } from "react";

const HistoryList = () => {
  const [list, setList] = useState<ChatHistoryItem[]>([]);

  const loadEntries = async () => {
    const db = isClient() ? await openDB() : null;
    if (db) {
      const historyList = (await getAll(db)).filter(
        (item) => item.urlId && item.description
      );
      setList(historyList);
    }
  };
  useEffect(() => {
    loadEntries();
  }, []);
  return <></>;
};
export default HistoryList;
