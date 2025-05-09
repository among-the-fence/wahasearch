import React from "react";
import JsonRenderer from "./ui/jsonRenderer";
import { WahaSearchLoader } from "./lib/models/wahaSearchLoader";

// You can replace this with any test/debug JSON data you want to inspect
const debugData = WahaSearchLoader.data();

const DebugPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>Debug JSON Viewer</h2>
      <JsonRenderer data={debugData} />
    </div>
  );
};

export default DebugPage;
