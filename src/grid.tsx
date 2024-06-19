import { Grid, Clipboard, showHUD, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";

const BASE_SIZE = 8;
const GRID_SCALE = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

type SvgProps = {
  size: number;
  bgColor?: string;
  x?: number;
  y?: number;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

type SvgItem = {
  id: number;
  rawSvg: string;
  previewSvg: string;
};

const createSvgString = ({
  size,
  bgColor = "red",
  x = 0,
  y = 0,
  color = "pink",
  strokeColor = "red",
  strokeWidth = 4,
}: SvgProps): string => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="background-color: ${bgColor}">
  <rect x="${x}" y="${y}" width="${size - x * 2}" height="${size - y * 2}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="${Math.max(10, size / 5)}" fill="black">${size}</text>
</svg>`;
};

const generateSvgGrid = (baseSize: number): string[] => {
  return GRID_SCALE.map((scale) => createSvgString({ size: baseSize * scale }));
};

const copySvgToClipboard = async (svg: string): Promise<void> => {
  try {
    await Clipboard.copy(svg);
    showHUD("SVG copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy SVG:", error);
    showHUD("Failed to copy SVG");
  }
};

const encodeSvgToBase64 = (svg: string): string => {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const createSvgItems = (svgStrings: string[]): SvgItem[] => {
  return svgStrings.map((svg, index) => ({
    id: index,
    rawSvg: svg,
    previewSvg: encodeSvgToBase64(svg),
  }));
};

export default function Command() {
  const svgStrings = generateSvgGrid(BASE_SIZE);

  const { isLoading, data } = usePromise(() => Promise.resolve(createSvgItems(svgStrings)), [], {});

  return (
    <Grid isLoading={isLoading}>
      {data?.map((item) => (
        <Grid.Item
          key={item.id}
          content={{ value: item.previewSvg, tooltip: "SVG Preview" }}
          title={`Size: ${GRID_SCALE[item.id] * BASE_SIZE}px`}
          actions={
            <ActionPanel>
              <Action title="Copy SVG" onAction={() => copySvgToClipboard(item.rawSvg)} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
