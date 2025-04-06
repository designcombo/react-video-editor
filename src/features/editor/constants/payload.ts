import { generateId } from "@designcombo/timeline";
import { DEFAULT_FONT } from "./font";

export const TEXT_ADD_PAYLOAD = {
  id: generateId(),
  display: {
    from: 0,
    to: 5000,
  },
  type: "text",
  details: {
    text: "Heading and some body",
    fontSize: 120,
    width: 600,
    fontUrl: DEFAULT_FONT.url,
    fontFamily: DEFAULT_FONT.postScriptName,
    color: "#ffffff",
    wordWrap: "break-word",
    textAlign: "center",
    borderWidth: 0,
    borderColor: "#000000",
    boxShadow: {
      color: "#ffffff",
      x: 0,
      y: 0,
      blur: 0,
    },
  },
};
