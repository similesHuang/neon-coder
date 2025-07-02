import { openDB } from "@/dao";
import { useRouter } from "next/router";

const persistenceEnabled = process.env.USE_INDEXED_DB === "true";
const neonDB = persistenceEnabled ? openDB() : undefined;
const useLocalHistory = () => {
  const router = useRouter();
};
