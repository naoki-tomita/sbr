import { WebSocketServer, WebSocket } from "ws";
import { Event } from "types";

const server = new WebSocketServer({ port: 8080 });
let manager: WebSocket | null;
let app: WebSocket | null;
server.on("connection", (con) => {
  con.onmessage = (e) => {
    const event: Event = JSON.parse(e.data.toString("utf-8"));
    switch (event.type) {
      case "hello": {
        if (event.name === "manager") {
          console.log("connected to manager")
          manager = con;
        } else {
          console.log("connected to app")
          app = con;
        }
        break;
      }
      default: {
        console.log("send data to app", event);
        app?.send(JSON.stringify(event));
      }
    }
  };
});

server.on("listening", () => console.log("Server ready."));