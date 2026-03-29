declare module "react-plotly.js" {
  import { ComponentType } from "react";

  type PlotProps = {
    data?: unknown[];
    layout?: Record<string, unknown>;
    config?: Record<string, unknown>;
    style?: Record<string, unknown>;
    onClick?: (event: { points?: Array<{ location?: string }> }) => void;
  };

  const Plot: ComponentType<PlotProps>;
  export default Plot;
}
