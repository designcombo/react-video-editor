import {
  Control,
  Image as ImageBase,
  ImageProps,
  Pattern,
  util,
} from "@designcombo/timeline";
import { createResizeControls } from "../controls";

class Image extends ImageBase {
  static type = "Image";

  static createControls(): { controls: Record<string, Control> } {
    return { controls: createResizeControls() };
  }

  constructor(props: ImageProps) {
    super(props);
    this.loadImage();
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    this.updateSelected(ctx);
  }

  public loadImage() {
    util.loadImage(this.src).then((img) => {
      const imgHeight = img.height;
      const rectHeight = this.height;
      const scaleY = rectHeight / imgHeight;
      const pattern = new Pattern({
        source: img,
        repeat: "repeat-x",
        patternTransform: [scaleY, 0, 0, scaleY, 0, 0],
      });
      this.set("fill", pattern);
      this.canvas?.requestRenderAll();
    });
  }

  public setSrc(src: string) {
    this.src = src;
    this.loadImage();
    this.canvas?.requestRenderAll();
  }
}

export default Image;
