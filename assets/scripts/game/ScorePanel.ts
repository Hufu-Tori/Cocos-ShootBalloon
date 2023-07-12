import { _decorator, Component, Label, Node } from 'cc';
import EventManager from './EventManager';
import { GameEvent } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('ScorePanel')
export class ScorePanel extends Component {

    @property({ type: Label })
    public scoreText: Label;


    show(score: number) {
        this.node.active = true;
        this.scoreText.string = "擊中: " + score.toString();
    }

    home() {
        EventManager.emit(GameEvent.GAME_GO_HOME);
    }

}


