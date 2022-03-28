import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import {type, Schema, MapSchema, ArraySchema} from '@colyseus/schema'
class Coordinates extends Schema{
    @type("number") x:number;
    @type("number") y:number;
    @type("number") z:number;
    constructor(x:number,y:number,z:number){
      super();
      this.x=x;
      this.y=y;
      this.z=z;
    }
}
class State extends Schema{
  @type({ map: Coordinates }) players = new MapSchema<Coordinates>();
}
export class MyRoom extends Room<State> {

  onCreate (options: any) {
    this.setState(new State());

    this.onMessage("position", (client, message) => {
        this.setPosition(client,message)
    });

  }
  setPosition(client:Client,data:any){
    let coordinates=new Coordinates(data.x,data.y,data.z);
    this.state.players.set(client.sessionId,coordinates)
  }
  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
