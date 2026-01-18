import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";

/**
 * Normalize Circle / Rectangle / Polygon → Polygon
 */
export function normalizeToPolygon(
  layerType: string,
  geoJson: Feature,
  layer: any
): Feature<Polygon> {
  if (layerType === "polygon" || layerType === "rectangle") {
    return geoJson as Feature<Polygon>;
  }

  if (layerType === "circle") {
    const center = layer.getLatLng();
    const radius = layer.getRadius();

    return turf.circle(
      [center.lng, center.lat],
      radius,
      { steps: 64, units: "meters" }
    ) as Feature<Polygon>;
  }

  throw new Error("Unsupported geometry type");
}

export function polygonIntersect(
  a: Feature<Polygon>,
  b: Feature<Polygon>
) {
  return turf.booleanIntersects(a, b);
}

/**
 * ❌ Block if NEW polygon fully encloses existing polygon
 */
export function isFullyContained(
  newPoly: Feature<Polygon>,
  existingPoly: Feature<Polygon>
) {
  return turf.booleanWithin(existingPoly, newPoly);
}

export function trimOverlap(
  newPoly: Feature<Polygon>,
  existingPoly: Feature<Polygon>
) {
  return turf.difference(newPoly, existingPoly);
}

/**
 * Core polygon validation logic
 */
export function processNewPolygon(
  newPolygon: Feature<Polygon>,
  existingPolygons: Feature<Polygon>[]
) {
  let processed = newPolygon;

  for (const existing of existingPolygons) {
    if (isFullyContained(processed, existing)) {
      throw new Error("Polygon fully encloses another polygon");
    }

    if (polygonIntersect(processed, existing)) {
      const diff = trimOverlap(processed, existing);
      if (!diff) {
        throw new Error("Polygon overlap not allowed");
      }
      processed = diff as Feature<Polygon>;
    }
  }

  return processed;
}
