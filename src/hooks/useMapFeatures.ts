import { useState } from "react";
import type { MapFeature } from "../types/geo";

export function useMapFeature() {
  const [features, setFeatures] = useState<MapFeature[]>([]);

  const addFeature = (feature: MapFeature) => {
    setFeatures(prev => [...prev, feature]);
  };

  return { features, addFeature };
}
