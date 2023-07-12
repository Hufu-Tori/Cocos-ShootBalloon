import { _decorator, CCInteger, Component, Label, Node } from 'cc';
import EventManager from './EventManager';
import { GameEvent } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('Countdown')
export class Countdown extends Component {

    @property({ type: Label })
    public label: Label;

    @property({ type: CCInteger })
    public time: number = 3;

    public run() {

        this.label.node.active = true;
        this.label.string = this.time.toString();

        let count = 0;

        this.schedule(() => {
            count++;
            const currentTime = (this.time - count);

            if (currentTime < 0) {
                this.label.node.active = false;

                EventManager.emit(GameEvent.COUNTDOWN_ENDS);
            }
            else {
                this.label.string = currentTime == 0 ? "GO" : currentTime.toString();
            }

        }, 1, this.time);
    }
}


