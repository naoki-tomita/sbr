import { LatLng, LatLngBounds } from "leaflet";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import { Event, InitializeEvent, PositionEvent } from "types";
import { PositionHistoryProvider, usePositionHistory } from "./PositionHistoryHooks";

class DataStream {
  ws: WebSocket;
  constructor(host: string, port: number) {
    this.ws = new WebSocket(`ws://${host}:${port}`);
    this.ws.onmessage = (e) => this.messageHandler(JSON.parse(e.data));
    this.ws.onopen = () => this.ws.send(JSON.stringify({ type: "hello", name: "client" }));
  }

  private messageHandler(e: Event) {
    switch (e.type) {
      case "initialize": {
        this.initializeHandler?.(e);
        break;
      }
      case "position": {
        this.positionHandler?.(e);
        break;
      }
    }
  }

  initializeHandler?: (e: InitializeEvent) => void;
  onInitialize(fn: (e: InitializeEvent) => void) {
    this.initializeHandler = fn;
  }

  positionHandler?: (e: PositionEvent) => void;
  onPosition(fn: (e: PositionEvent) => void) {
    this.positionHandler = fn;
  }

  close() {
    return this.ws.close();
  }
}

const MapController = () => {
  const map = useMap();
  const { addPosition, resetPositions } = usePositionHistory();
  useEffect(() => {
    const ds = new DataStream("localhost", 8080);
    ds.onInitialize(() => resetPositions());
    ds.onPosition(({ id, lat, lng, alt }) => addPosition(id, { lat, lng, alt }));
    return () => ds.close();
  }, []);
  return null;
}

const App = () => {
  const { positions } = usePositionHistory();
  return (
    <>
    <style>{`* { margin: 0; padding: 0; }`}</style>
    <style>{`#map { height: 100vh; }`}</style>
    <MapContainer
      id="map"
      center={[35.707043, 139.779129]}
      zoom={13}
      scrollWheelZoom={true}
    >
      {Object.entries(positions).map(([id, positions]) =>
        <Marker
          key={id}
          position={new LatLng(positions.at(-1)!.lat, positions.at(-1)!.lng, positions.at(-1)!.alt)}
          title={id}
        />)}
      <MapController />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
    </>
  );
}

const root = createRoot(document.querySelector("#app")!);
root.render(<PositionHistoryProvider><App /></PositionHistoryProvider>);