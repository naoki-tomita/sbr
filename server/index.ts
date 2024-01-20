import { WebSocketServer, WebSocket, MessageEvent } from "ws";
import { Event, HelloEvent } from "types";

class App {
  wss: WebSocketServer;
  dataStreams: WebSocket[] = [];
  clients: WebSocket[] = [];

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.wss.on("connection", this.handleConnection.bind(this));
    this.wss.on("listening", () => console.log("Listening..."));
  }

  handleConnection(ws: WebSocket) {
    console.log("Connecting...")
    ws.onmessage = (e) => {
      const event: HelloEvent = JSON.parse(e.data.toString("utf-8"));
      if (event.type !== "hello") return;
      if (event.name === "data-stream") {
        ws.onmessage = this.handleDataStreamMessage.bind(this);
        this.dataStreams.push(ws);
      } else if (event.name === "client") {
        ws.onmessage = this.handleClientMessage.bind(this);
        this.clients.push(ws);
      }
      console.log("Connected!", event.name);
    }
    ws.onclose = () => {
      console.log("Disconnecting...");
      this.clients = this.clients.filter(it => it !== ws);
      this.dataStreams.filter(it => it !== ws);
    }
  }

  handleDataStreamMessage(e: MessageEvent) {
    const data = e.data.toString("utf-8");
    console.log(`DataStream -> Incomming message`, data);
    const event: Event = JSON.parse(data);
    this.broadcast(event);
  }

  handleClientMessage(e: MessageEvent) {
    // do nothing
  }

  broadcast(e: Event) {
    console.log(`Broadcast message -> Client`, this.clients.length);
    this.clients.forEach(it => it.send(JSON.stringify(e)))
  }
}

const app = new App(8080);
