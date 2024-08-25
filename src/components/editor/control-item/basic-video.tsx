import { Button } from "@/components/ui/button";
import { EDIT_OBJECT, dispatcher } from "@designcombo/core";

const BasicVideo = () => {
  const handleAddBackground = () => {
    dispatcher.dispatch(EDIT_OBJECT, {
      payload: {
        details: {
          background: "rgba(60, 64, 198,1.0)",
        },
      },
    });
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-md flex-none text-text-primary font-medium h-12  flex items-center px-4">
        BasicVideo
      </div>
      <div>
        <Button onClick={handleAddBackground}>Add background</Button>
      </div>
    </div>
  );
};

export default BasicVideo;
