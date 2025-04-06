import { FabricObject, util } from "@designcombo/timeline";

export function drawVerticalLine(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  _: {},
  fabricObject: FabricObject,
) {
  const cSize = 12;
  const cSizeBy2 = cSize / 2;

  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(90 + fabricObject.angle));

  // Draw the yellow outline
  ctx.lineWidth = 6; // Total width for the outline (4 + 2)
  ctx.lineCap = "round";
  ctx.strokeStyle = "white"; // Yellow color for the outline
  ctx.beginPath();
  ctx.moveTo(-cSizeBy2, 0);
  ctx.lineTo(cSizeBy2, 0);
  ctx.stroke();

  // Draw the main line
  ctx.lineWidth = 4; // Width of the main line
  ctx.strokeStyle = "black"; // Color of the main line
  ctx.beginPath();
  ctx.moveTo(-cSizeBy2, 0);
  ctx.lineTo(cSizeBy2, 0);
  ctx.stroke();

  ctx.restore();
}

export function drawVerticalLeftIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: any,
  fabricObject: FabricObject,
) {
  const width = 12; // Rectangle width
  const height = fabricObject.height;
  const leftBorderRadius = 4; // Border radius for left corners

  ctx.save(); // Save canvas state
  ctx.translate(left + 6, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));

  // Draw the rectangle with left corners rounded
  ctx.fillStyle = "rgba(255,255,255, 0.85)";
  ctx.beginPath();
  ctx.moveTo(-width / 2, -height / 2 + leftBorderRadius);
  ctx.lineTo(-width / 2, height / 2 - leftBorderRadius);
  ctx.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2 + leftBorderRadius,
    height / 2,
  );
  ctx.lineTo(width / 2, height / 2);
  ctx.lineTo(width / 2, -height / 2);
  ctx.lineTo(-width / 2 + leftBorderRadius, -height / 2);
  ctx.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2,
    -height / 2 + leftBorderRadius,
  );
  ctx.fill();

  // Draw the two lines, centered horizontally within the rectangle
  const lineWidth = 1;
  const lineHeight = Math.min(height * 0.45, 100);
  const lineSpacing = 2;
  ctx.fillStyle = "#000"; // Line color

  // Calculate the x positions for the two lines
  const firstLineX = -lineWidth / 2 - lineSpacing / 2 - 1;
  const secondLineX = lineWidth / 2 + lineSpacing / 2 - 1;

  // Draw the first line
  ctx.fillRect(firstLineX, -lineHeight / 2, lineWidth, lineHeight);

  // Draw the second line
  ctx.fillRect(secondLineX, -lineHeight / 2, lineWidth, lineHeight);
  ctx.restore();
}

export function drawVerticalRightIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  styleOverride: any,
  fabricObject: FabricObject,
) {
  const width = 12; // Rectangle width
  const height = fabricObject.height;
  const rightBorderRadius = 4; // Border radius for right corners

  ctx.save(); // Save canvas state
  ctx.translate(left - 6, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));

  // Draw the rectangle with right corners rounded
  ctx.fillStyle = "rgba(255,255,255, 0.85)";
  ctx.beginPath();
  ctx.moveTo(width / 2, -height / 2 + rightBorderRadius);
  ctx.lineTo(width / 2, height / 2 - rightBorderRadius);
  ctx.quadraticCurveTo(
    width / 2,
    height / 2,
    width / 2 - rightBorderRadius,
    height / 2,
  );
  ctx.lineTo(-width / 2, height / 2);
  ctx.lineTo(-width / 2, -height / 2);
  ctx.lineTo(width / 2 - rightBorderRadius, -height / 2);
  ctx.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    -height / 2 + rightBorderRadius,
  );
  ctx.fill();

  // Draw the two lines, centered horizontally within the rectangle
  const lineWidth = 1;
  const lineHeight = Math.min(height * 0.45, 100);
  const lineSpacing = 2;
  ctx.fillStyle = "#000"; // Line color

  // Calculate the x positions for the two lines
  const firstLineX = -lineWidth / 2 - lineSpacing / 2 - 1;
  const secondLineX = lineWidth / 2 + lineSpacing / 2 - 1;

  // Draw the first line
  ctx.fillRect(firstLineX, -lineHeight / 2, lineWidth, lineHeight);

  // Draw the second line
  ctx.fillRect(secondLineX, -lineHeight / 2, lineWidth, lineHeight);

  ctx.restore();
}
