import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { useState } from "react";
interface RectangleFormInput {
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  strokeColor: string;
  bgColor: string;
}
export default function GenerateSvgRectangle() {
  const [input, setInput] = useState<RectangleFormInput>({
    width: 64,
    height: 64,
    color: "pink",
    strokeWidth: 4,
    strokeColor: "red",
    bgColor: "red",
  });
  const handleSubmit = async () => {
    const { width, height, color, strokeWidth, strokeColor, bgColor } = input;
    const x = parseInt(strokeWidth) / 2;
    const y = parseInt(strokeWidth) / 2;
    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background-color: ${bgColor}">
  <rect x="${x}" y="${y}" width="${width - x * 2}" height="${height - y * 2}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14">${width} x ${height}</text>
  </svg>
`;
    // Copy the SVG to the clipboard
    await Clipboard.copy(svg);
    showHUD("SVG copied to clipboard!");
  };
  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="Generate SVG and Copy" onAction={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="width"
        title="Width"
        placeholder="Enter width in px"
        value={input.width}
        onChange={(newValue) => setInput({ ...input, width: newValue })}
      />
      <Form.TextField
        id="height"
        title="Height"
        placeholder="Enter height in px"
        value={input.height}
        onChange={(newValue) => setInput({ ...input, height: newValue })}
      />
      <Form.TextField
        id="strokeWidth"
        title="Stroke Width"
        placeholder="Enter stroke width in px"
        value={input.strokeWidth}
        onChange={(newValue) => setInput({ ...input, strokeWidth: newValue })}
      />
    </Form>
  );
}
