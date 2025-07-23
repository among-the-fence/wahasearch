import React from "react";
import JsonRenderer from "./ui/jsonRenderer";
import { Catalogue } from "./lib/models/catalogue";
import debugDataAeldari from "./lib/data/wh40k-10eAeldari - Aeldari Library.cat.json";

const debugData = new Catalogue(debugDataAeldari);

const DebugPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>Debug JSON Viewer</h2>
      <JsonRenderer data={debugData} />
    </div>
  );
};

export default DebugPage;
