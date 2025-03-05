import createEdgeClient from "@honeycomb-protocol/edge-client";
import { EDGE_CLIENT } from "@/config/config";

let edgeClientInstance = null;

export function getEdgeClient() {
  if (!edgeClientInstance || Object.keys(edgeClientInstance).length === 0) {
    edgeClientInstance = createEdgeClient(EDGE_CLIENT, true);
    console.log("Edge Client initialized in backend");
  }
  return edgeClientInstance;
}
