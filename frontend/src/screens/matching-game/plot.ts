import Konva from 'konva';


export function addLinearPlot(
  stage: Konva.Stage,
  m: number,
  b: number,
  options: {
    x?: number;
    y?: number;
    lineColor?: string;
    lineWidth?: number;
    grid?: boolean;
    backgroundColor?: string;
  } = {}
): Konva.Group {
  const {
    x = 50,
    y = 50,
    lineColor = 'red',
    lineWidth = 2,
    grid = true,
    backgroundColor = '#f8f9fa',
  } = options;

  const SIZE = 200;
  const PADDING = 10;

  const X_MIN = -10;
  const X_MAX = 10;
  const Y_MIN = -10;
  const Y_MAX = 10;

  const plotWidth = SIZE - 2 * PADDING;
  const plotHeight = SIZE - 2 * PADDING;

  const toPixelX = (gx: number) => PADDING + ((gx - X_MIN) / (X_MAX - X_MIN)) * plotWidth;
  const toPixelY = (gy: number) => PADDING + ((Y_MAX - gy) / (Y_MAX - Y_MIN)) * plotHeight;

  // Get existing layer or create one if stage is empty
  let layer = stage.getLayers()[0];
  if (!layer) {
    layer = new Konva.Layer();
    stage.add(layer);
  }

  // Main group for the entire plot
  const plotGroup = new Konva.Group({ x, y });

  // Background
  plotGroup.add(
    new Konva.Rect({
      width: SIZE,
      height: SIZE,
      fill: backgroundColor,
      stroke: '#333',
      strokeWidth: 2,
      cornerRadius: 8,
    })
  );

  // Grid
  if (grid) {
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const gx = X_MIN + t * (X_MAX - X_MIN);
      const gy = Y_MIN + t * (Y_MAX - Y_MIN);

      // Vertical grid line
      plotGroup.add(
        new Konva.Line({
          points: [toPixelX(gx), PADDING, toPixelX(gx), SIZE - PADDING],
          stroke: '#e0e0e0',
          strokeWidth: 1,
        })
      );

      // Horizontal grid line
      plotGroup.add(
        new Konva.Line({
          points: [PADDING, toPixelY(gy), SIZE - PADDING, toPixelY(gy)],
          stroke: '#e0e0e0',
          strokeWidth: 1,
        })
      );
    }
  }

  // Axes
  plotGroup.add(
    new Konva.Line({
      points: [PADDING, toPixelY(0), SIZE - PADDING, toPixelY(0)],
      stroke: '#222',
      strokeWidth: 2,
    })
  );
  plotGroup.add(
    new Konva.Line({
      points: [toPixelX(0), PADDING, toPixelX(0), SIZE - PADDING],
      stroke: '#222',
      strokeWidth: 2,
    })
  );

  // The actual line y = mx + b
  const points = clipLineToRect(m,b,-10,10,-10,10);
  const [x1, y1, x2, y2] = points;
  

  plotGroup.add(
    new Konva.Line({
      points: [toPixelX(x1), toPixelY(y1), toPixelX(x2), toPixelY(y2)],
      stroke: lineColor,
      strokeWidth: lineWidth,
      lineCap: 'round',
    })
  );

  // Add the group to the layer (no null possible now)
  layer.add(plotGroup);
  layer.batchDraw(); // efficient redraw

  return plotGroup;
}

function clipLineToRect(
  m: number,
  b: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): number[] {
  const y = (x: number) => m * x + b;
  const x = (yVal: number) => (yVal - b) / m;

  // Find intersection points with the four borders
  const candidates: [number, number][] = [];

  // Left border: x = xMin
  const yLeft = y(xMin);
  if (yLeft >= yMin && yLeft <= yMax) candidates.push([xMin, yLeft]);

  // Right border: x = xMax
  const yRight = y(xMax);
  if (yRight >= yMin && yRight <= yMax) candidates.push([xMax, yRight]);

  // Bottom border: y = yMin
  if (m !== 0) {
    const xBottom = x(yMin);
    if (xBottom >= xMin && xBottom <= xMax) candidates.push([xBottom, yMin]);
  }

  // Top border: y = yMax
  if (m !== 0) {
    const xTop = x(yMax);
    if (xTop >= xMin && xTop <= xMax) candidates.push([xTop, yMax]);
  }

  // Need exactly 2 distinct points
  if (candidates.length >= 2) {
    const p1 = candidates[0];
    const p2 = candidates[candidates.length === 2 ? 1 : 0];
    return [p1[0], p1[1], p2[0], p2[1]];
  }

  return []; // no visible segment
}