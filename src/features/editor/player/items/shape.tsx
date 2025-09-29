import { IShape } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { BoxAnim, ContentAnim, MaskAnim } from "@designcombo/animations";
import { calculateContainerStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";

export const Shape = ({
  item,
  options
}: {
  item: IShape;
  options: SequenceItemOptions;
}) => {
  const { fps, frame } = options;
  const { details, animations } = item;
  const { animationIn, animationOut, animationTimed } = getAnimations(
    animations!,
    item,
    frame,
    fps
  );
  const { durationInFrames } = calculateFrames(item.display, fps);
  const currentFrame = (frame || 0) - (item.display.from * fps) / 1000;
  const children = (
    <BoxAnim
      style={calculateContainerStyles(details)}
      animationIn={animationIn}
      animationOut={animationOut}
      frame={currentFrame}
      durationInFrames={durationInFrames}
    >
      <ContentAnim
        animationTimed={animationTimed}
        durationInFrames={durationInFrames}
        frame={currentFrame}
        style={calculateContainerStyles(details)}
      >
        <MaskAnim
          item={item}
          keyframeAnimations={animationTimed}
          frame={frame || 0}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              WebkitMaskImage: `url(${details.src})`,
              WebkitMaskSize: "cover",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              backgroundColor: details.backgroundColor || "#808080"
            }}
          />
        </MaskAnim>
      </ContentAnim>
    </BoxAnim>
  );
  return BaseSequence({ item, options, children });
};

export default Shape;
