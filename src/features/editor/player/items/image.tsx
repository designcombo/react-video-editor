import { IImage } from "@designcombo/types";
import { BaseSequence, SequenceItemOptions } from "../base-sequence";
import { BoxAnim, ContentAnim, MaskAnim } from "@designcombo/animations";
import { calculateContainerStyles, calculateMediaStyles } from "../styles";
import { getAnimations } from "../../utils/get-animations";
import { calculateFrames } from "../../utils/frames";
import { Img } from "remotion";

export default function Image({
  item,
  options
}: {
  item: IImage;
  options: SequenceItemOptions;
}) {
  const { fps, frame } = options;
  const { details, animations } = item;
  const { animationIn, animationOut, animationTimed } = getAnimations(
    animations!,
    item,
    frame,
    fps
  );
  const crop = details?.crop || {
    x: 0,
    y: 0,
    width: details.width,
    height: details.height
  };
  const { durationInFrames } = calculateFrames(item.display, fps);
  const currentFrame = (frame || 0) - (item.display.from * fps) / 1000;

  const children = (
    <BoxAnim
      style={calculateContainerStyles(details, crop, {
        transform: "scale(1)"
      })}
      animationIn={animationIn!}
      animationOut={animationOut!}
      frame={currentFrame}
      durationInFrames={durationInFrames}
    >
      <ContentAnim
        animationTimed={animationTimed!}
        durationInFrames={durationInFrames}
        frame={currentFrame}
      >
        <MaskAnim
          item={item}
          keyframeAnimations={animationTimed!}
          frame={frame || 0}
        >
          <div
            id={`${item.id}-reveal-mask`}
            style={calculateMediaStyles(details, crop)}
          >
            {/* image layer */}
            <Img data-id={item.id} src={details.src} />
          </div>
        </MaskAnim>
      </ContentAnim>
    </BoxAnim>
  );

  return BaseSequence({ item, options, children });
}
