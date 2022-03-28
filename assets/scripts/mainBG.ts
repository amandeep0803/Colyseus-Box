
import { _decorator, Component, Node, Prefab, instantiate, EventKeyboard, KeyCode } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('mainBG')
export class mainBG extends Component {
    
    @property({type:Prefab})
    box!:Prefab;
    @property({type:Node})
    joinBtn!:Node;
    @property({type:Node})
    leaveBtn!:Node;
    start () {

    }
    joinBtnClick(){
        this.joinBtn.active=false;
        this.leaveBtn.active=true;
    }
    leaveBtnClick(){
        this.joinBtn.active=true;
        this.leaveBtn.active=false;
    }
    addBox(toPosition:boolean,position:any,name:string){
        if(!this.node.getChildByName(name)){
            let temp=instantiate(this.box);
            this.node.addChild(temp);
            temp.name=name;
            if(!toPosition){
                temp.setPosition(Math.floor(Math.random()*400),Math.floor(Math.random()*200),1);
            }
            else{
                temp.setPosition(position.x,position.y,position.z);
            }
            return temp.position;
        }
        return position;
    }
    removeBox(name:string){
        if(this.node.getChildByName(name)){
            let temp:any=this.node.getChildByName(name);
            this.node.removeChild(temp);
            temp.destroy();
        }
    }
    moveBox(event:EventKeyboard,name:string){
        let temp:any=this.node.getChildByName(name);
        let position:any=temp.position;
        switch(event.keyCode){
            case KeyCode.ARROW_UP:
                position.y+=10;
                break;
            case KeyCode.ARROW_DOWN:
                position.y-=10;
                break;
            case KeyCode.ARROW_LEFT:
                position.x-=10;
                break;
            case KeyCode.ARROW_RIGHT:
                position.x+=10;
                break;
        }
        temp.position=position;
        return position;
    }
    changePosition(position:any,name:string){
        let temp:any=this.node.getChildByName(name);
        temp.position=position;
    }
}

