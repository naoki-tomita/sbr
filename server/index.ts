import { WebSocketServer, WebSocket } from "ws";

const server = new WebSocketServer({ port: 8080 });
let manager: WebSocket | null;
let app: WebSocket | null;
server.on("connection", (con) => {
  con.onmessage = (e) => {
    const data = JSON.parse(e.data.toString("utf-8")) as ({ type: string } | { x: number, y: number, z: number });
    if ("type" in data) {
      if (data.type === "manager") {
        console.log("connected to manager")
        manager = con;
      } else {
        console.log("connected to app")
        app = con;
      }
    } else {
      console.log("send data to app", data);
      app?.send(JSON.stringify(data));
    }
  };
});

server.on("listening", () => console.log("listening!"));