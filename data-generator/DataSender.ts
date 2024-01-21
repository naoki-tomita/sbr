import { InitializeEvent, PositionEvent } from "types";
import { WebSocket } from "ws";

export class DataSender {
  ws: WebSocket;
  constructor(host: string, port: number) {
    // sslのときエラーになるよ
    this.ws = new WebSocket(`ws://${host}:${port}`);
  }

  async initialize() {
    return new Promise<void>(ok => {
      this.ws.once("open", () => {
        this.ws.send(JSON.stringify({ type: "hello", name: "data-stream" }));
        ok();
      })
    });
  }

  send(id: string, eventAt: number, lng: number, lat: number, alt?: number) {
    const event: PositionEvent = {
      type: "position",
      id,
      at: eventAt,
      lng, lat, alt
    };
    this.ws.send(JSON.stringify(event));
  }

  close() {
    this.ws.close();
  }
}