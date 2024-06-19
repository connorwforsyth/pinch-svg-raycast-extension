import { Grid, Clipboard, showHUD, ActionPanel, Action } from "@raycast/api";
import { useState } from "react";
import { usePromise } from "@raycast/utils";

const gridScale = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

type BaseSize = 5 | 8;

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
  strokeWidth = 1,
}: SvgProps): string => {
  const fontSize = size <= 32 ? size / 2 : Math.max(16, size / 4);
  const textX = size * 0.5;
  const textY = size * 0.5; // Adjusted for vertical alignment to be exactly in the middle
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="background-color: ${bgColor}">
  <rect x="${x}" y="${y}" width="${size - x * 2}" height="${size - y * 2}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
  <text x="${textX}" y="${textY}" dominant-baseline="middle" text-anchor="middle" font-family="arial" font-size="${fontSize}" fill="black">${size}</text>
</svg>`;
};

const generateSvgGrid = (baseSize: number, scaleArray: number[]): string[] => {
  return scaleArray.map((scale) => createSvgString({ size: baseSize * scale }));
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
  const [baseSize, setBaseSize] = useState<BaseSize>(8);

  const { isLoading, data } = usePromise(() => {
    const svgStrings = generateSvgGrid(baseSize, gridScale);
    return Promise.resolve(createSvgItems(svgStrings));
  }, [baseSize]);

  return (
    <Grid
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Select Grid Size"
          storeValue={true}
          defaultValue={String(baseSize)}
          onChange={(newValue) => setBaseSize(Number(newValue) as BaseSize)}
        >
          <Grid.Dropdown.Section title="Grid Sizes">
            <Grid.Dropdown.Item title="8 Point Grid" value="8" />
            <Grid.Dropdown.Item title="5 Point Grid" value="5" />
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      {data?.map((item) => (
        <Grid.Item
          key={item.id}
          content={{ value: item.previewSvg, tooltip: `Copy ${gridScale[item.id] * baseSize}px Rectangle` }}
          title={`${gridScale[item.id] * baseSize}px`}
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
