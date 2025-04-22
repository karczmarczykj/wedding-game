export interface PadsState {
  count: number;
  [key: string]: string | number;
}

type PadStateCallback = (padsState: PadsState) => void;

export function setupPadsClient(websocket : WebSocket, padStateCallback : PadStateCallback) : void {
  let padsState: PadsState = {
    count: 0,
  };

  websocket.onmessage = (event) => {
    if (event.data === 'Release') {
      padsState = {
        count: padsState.count,
      };
    } else if (event.data.includes("pads_cnt")) {
      const text = event.data;
      const trimmed = text.replace(/^.*:/, '').trim();
      padsState.count = parseInt(trimmed, 10);
    } else {
      const text = event.data;
      const trimmed = text.replace(/^current\s*:\s*/, '').trim();
      const jsonLike = `{${trimmed}}`;
      padsState = { count: padsState.count , ...JSON.parse(jsonLike) };
    }
    padStateCallback(padsState);
  }
}

export function lightPads(websocket: WebSocket, pads: Set<number>) : void {
  if (websocket.readyState === WebSocket.OPEN) {
    const padsArray = Array.from(pads);
    const padsString = padsArray.join(',');
    websocket.send(`Lights: [${padsString}]`);
  }
}
