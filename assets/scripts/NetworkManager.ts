import { _decorator, Component, Node, TypeScript, Input, input, EventKeyboard, KeyCode, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import Colyseus,{Room} from 'db://colyseus-sdk/colyseus.js';

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    @property hostname = "localhost";
    @property port = 2567;
    @property useSSL = false;
    @property({type:Node})
    mainBG!:Node
    mainBGScript!:any;
    client!: Colyseus.Client;
    room!: Colyseus.Room;

    start () {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);
        console.log(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);
        // Connect into the room
        this.mainBGScript=this.mainBG.getComponent('mainBG');
    }
    joinBtnClick(){
        this.mainBGScript.joinBtnClick();
        this.connect();
        input.on(Input.EventType.KEY_DOWN,this.KeyPressed,this);
    }
    leaveBtnClick(){
        this.mainBGScript.leaveBtnClick();
        this.room.leave()
        input.off(Input.EventType.KEY_DOWN,this.KeyPressed,this);
    }
    KeyPressed(event:EventKeyboard){
        let newPosition:any=this.mainBGScript.moveBox(event,this.room.sessionId);
        this.room.send('position',{x:newPosition.x,y:newPosition.y,z:newPosition.z})
    }
    async connect() { 
        try {
            this.room = await this.client.joinOrCreate("my_room");
            let position=this.mainBGScript.addBox(false,{x:0,y:0,z:0},this.room.sessionId);
            this.room.send("position",{x:position.x,y:position.y,z:position.z})
            this.room.state.players.onAdd = (item:any,key:string) => {
                let demo=this.mainBGScript.addBox(true,{x:item.x,y:item.y,z:item.z},key)
            }
            this.room.state.players.onRemove=(item:any,key:string)=>{
                this.mainBGScript.removeBox(key);
            }
            console.log(this.room);
            console.log(this.room.state)
            console.log("joined successfully!");
            console.log("user's sessionId:", this.room.sessionId);
            this.room.state.players.onChange=(item:any,key:string)=>{
                this.mainBGScript.changePosition(new Vec3(item.x,item.y,item.z),key);
            }
            this.room.onStateChange((state) => {
                console.log("onStateChange: ", state);
            });
            this.room.onLeave((code) => {
                for(let player of this.room.state.players.keys()){
                    this.mainBGScript.removeBox(player);
                }
                console.log("onLeave:", code);
            });
        } catch (e) {
            console.error(e);
        }
    }
}