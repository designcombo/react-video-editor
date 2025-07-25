import {
	Resizable,
	ResizableProps,
	Pattern,
	util,
	Control,
} from "@designcombo/timeline";

interface ImageProps extends ResizableProps {
	src: string;
}

class Image extends Resizable {
	static type = "Image";
	public src: string;
	public hasSrc = true;

	constructor(props: ImageProps) {
		super(props);
		this.id = props.id;
		this.src = props.src;
		this.display = props.display;
		this.tScale = props.tScale;
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
