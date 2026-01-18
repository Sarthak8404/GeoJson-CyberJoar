import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { useMapFeature } from "../hooks/useMapFeatures";
import { processNewPolygon, normalizeToPolygon } from "../utils/geometry";
import { SHAPE_LIMITS } from "../config/shapeLimits";
import type { MapFeature } from "../types/geo";
import ExportButton from "./exportButton";

export default function FetchMap() {
  const { features, addFeature } = useMapFeature();

  const handleCreate = (e: any) => {
    const geoJson = e.layer.toGeoJSON();
    const layerType = e.layerType;

    // 🔢 Shape limit check
    const count = features.filter(
      f => f.properties.shapeType === layerType
    ).length;

    if (count >= SHAPE_LIMITS[layerType]) {
      alert(`Maximum ${layerType} limit reached`);
      return;
    }

    const baseFeature: MapFeature = {
      ...geoJson,
      properties: { shapeType: layerType }
    };

    // ✅ LineStrings bypass geometry rules
    if (geoJson.geometry.type === "LineString") {
      addFeature(baseFeature);
      return;
    }

    try {
      const normalizedPolygon = normalizeToPolygon(
        layerType,
        geoJson,
        e.layer
      );

      const existingPolygonFeatures = features.filter(
        f => f.geometry.type === "Polygon"
      );

      const processed = processNewPolygon(
        normalizedPolygon,
        existingPolygonFeatures as any
      );

      const finalFeature: MapFeature = {
        ...processed,
        properties: { shapeType: layerType }
      };

      addFeature(finalFeature);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <ExportButton features={features} />

      <MapContainer
        center={[23, 78]}
        zoom={8}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              polyline: true,
              marker: false,
              circlemarker: false
            }}
            onCreated={handleCreate}
          />
        </FeatureGroup>
      </MapContainer>
    </>
  );
}
