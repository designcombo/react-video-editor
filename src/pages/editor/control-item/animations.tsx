import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Animations = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="text-md text-text-primary flex h-12 flex-none items-center px-4 font-medium">
        Animations
      </div>
      <div className="px-4">
        <Tabs defaultValue="in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">In</TabsTrigger>
            <TabsTrigger value="out">Out</TabsTrigger>
          </TabsList>
          <TabsContent value="in"></TabsContent>
          <TabsContent value="out"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Animations;
