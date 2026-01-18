import type { MapFeature } from "../types/geo";

export default function ExportButton({ features }: { features: MapFeature[] }) {
  const handleExport = () => {
    const geoJson = {
      type: "FeatureCollection",
      features
    };

    const blob = new Blob(
      [JSON.stringify(geoJson, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-features.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        padding: "8px 12px"
      }}
    >
      Export GeoJSON
    </button>
  );
}
