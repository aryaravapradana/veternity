"use client";

import { Map, MapControls, MapGeoJSON } from "@/components/ui/map";
import { Card } from "@/components/ui/card";

export default function MyMap() {
  return (
    <div className="min-h-screen bg-[#F8F6F0] p-12 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-black text-[#1C241E] uppercase">FarmPro Distribution Map</h1>
        <p className="text-[#5A635B] font-medium">
          Customized mapcn map using our brand colors (Forest, Sage, Rust).
        </p>

        {/* Snippet integration: Wrapped in Card, with custom colors via MapGeoJSON */}
        <Card className="h-[400px] p-0 overflow-hidden border-4 border-[#2B4C3B] shadow-2xl">
          <Map blank center={[113.9213, -0.7893]} zoom={4.5}>
            <MapGeoJSON
              data="https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson"
              promoteId="ISO_A3"
              fillPaint={{ "fill-color": "#2B4C3B" }} // Forest
              linePaint={{ "line-color": "#B4C179", "line-width": 1 }} // Sage
              fillHoverPaint={{ "fill-color": "#C25939" }} // Rust on hover
              interactive={true}
            />
            <MapControls />
          </Map>
        </Card>
      </div>
    </div>
  );
}
