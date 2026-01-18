import type { Feature } from "geojson";

export interface MapFeature extends Feature {
  properties: {
    shapeType: "polygon" | "rectangle" | "circle" | "polyline";
  };
}
