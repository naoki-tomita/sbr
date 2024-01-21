import { transit_realtime } from "gtfs-realtime-bindings";
import { DataSender } from "./DataSender";
const { FeedMessage } = transit_realtime;

function sleep(timeoutMs: number) {
  return new Promise(ok => setTimeout(ok, timeoutMs));
}

async function main() {
  const dataSender = new DataSender("localhost", 8080);
  await dataSender.initialize();
  while (true) {
    const response = await fetch("https://api-public.odpt.org/api/v4/gtfs/realtime/ToeiBus");
    const body = await response.arrayBuffer().then(it => new Uint8Array(it))
    const result = FeedMessage.decode(body);
    result.entity.forEach(({ id, vehicle }) => {
      if (!vehicle?.position) return;
      dataSender.send(id, Date.now(), vehicle.position.longitude, vehicle?.position.latitude);
    })
    await sleep(10000);
  }
}

main();