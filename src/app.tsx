import { useEffect } from "react";
import Editor from "./pages/editor";
import useAuthStore from "./store/use-auth-store";
import useDataState from "./pages/editor/store/use-data-state";
import { getCompactFontData } from "./pages/editor/utils/fonts";
import { FONTS } from "./data/fonts";

export default function App() {
  const { user } = useAuthStore();
  const { setCompactFonts, setFonts } = useDataState();

  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  useEffect(() => {
    if (user?.id) {
    }
  }, [user?.id]);

  return <Editor />;
}
