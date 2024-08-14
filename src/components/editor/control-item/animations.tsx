import { ScrollArea } from "@/components/ui/scroll-area";
import { EDIT_OBJECT, dispatcher } from "@designcombo/core";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Animations = () => {
  const handleOnClick = (animation: any) => {
    dispatcher.dispatch(EDIT_OBJECT, {
      payload: {
        animation: {
          [animation.type]: {
            name: animation.name,
          },
        },
      },
    });
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        Animations
      </div>
      <div className="px-4"></div>
    </div>
  );
};

export default Animations;
