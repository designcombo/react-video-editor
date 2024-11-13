import useLayoutStore from "../store/use-layout-store";
import { Transitions } from "./transitions";
import { Texts } from "./texts";
import { Uploads } from "./uploads";
import { Audios } from "./audios";
import { Elements } from "./elements";
import { Images } from "./images";
import { Videos } from "./videos";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Captions } from "./captions";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { showMenuItem, setShowMenuItem } = useLayoutStore();
  return (
    <div
      style={{
        left: showMenuItem ? "0" : "-100%",
        transition: "left 0.25s ease-in-out",
        zIndex: 200,
      }}
      className="absolute top-1/2 mt-6 flex h-[calc(100%-32px-64px)] w-[340px] -translate-y-1/2 rounded-lg shadow-lg"
    >
      <div className="w-[74px]"></div>
      <div className="relative flex flex-1 bg-background/80 backdrop-blur-lg backdrop-filter">
        <Button
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
          size="icon"
        >
          <X width={16} onClick={() => setShowMenuItem(false)} />
        </Button>
        {children}
      </div>
    </div>
  );
};

const ActiveMenuItem = () => {
  const { activeMenuItem } = useLayoutStore();
  if (activeMenuItem === "transitions") {
    return <Transitions />;
  }
  if (activeMenuItem === "texts") {
    return <Texts />;
  }
  if (activeMenuItem === "shapes") {
    return <Elements />;
  }
  if (activeMenuItem === "videos") {
    return <Videos />;
  }
  if (activeMenuItem === "captions") {
    return <Captions />;
  }

  if (activeMenuItem === "audios") {
    return <Audios />;
  }

  if (activeMenuItem === "images") {
    return <Images />;
  }
  if (activeMenuItem === "uploads") {
    return <Uploads />;
  }
  return null;
};

export const MenuItem = () => {
  return (
    <Container>
      <ActiveMenuItem />
    </Container>
  );
};
