export type Position = {
  lat: number;
  lng: number;
  alt: number;
}
export type HelloEvent = { type: "hello", name: string };
export type InitializeEvent = { type: "initialize", center: Position, max: Position, min: Position };
export type PositionEvent = { type: "position", at: number } & Position;
export type Event = HelloEvent | InitializeEvent | PositionEvent;