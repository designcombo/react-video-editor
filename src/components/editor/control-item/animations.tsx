import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ANIMATIONS,
  EDIT_OBJECT,
  IAnimate,
  dispatcher,
  useEditorState,
} from '@designcombo/core';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const { trackItemsMap, activeIds } = useEditorState();
  const targetType = trackItemsMap[activeIds[0]]?.type;
  const filteredAnimations =
    targetType === 'text'
      ? ANIMATIONS
      : ANIMATIONS.filter((animation) => animation.category === 'element');
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        Animations
      </div>
      <div className="px-4">
        <Tabs defaultValue="in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">In</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
          </TabsList>
          <TabsContent value="in">
            {filteredAnimations
              .filter((i) => i.type === 'in')
              .map((animation, index) => (
                <div
                  onClick={() => handleOnClick(animation)}
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-zinc-600"></div>
                  <div> {animation.name || animation.type}</div>
                </div>
              ))}
          </TabsContent>
          <TabsContent value="out">
            {' '}
            {filteredAnimations
              .filter((i) => i.type === 'out')
              .map((animation, index) => (
                <div
                  onClick={() => handleOnClick(animation)}
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-zinc-600"></div>
                  <div> {animation.name || animation.type}</div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Animations;
