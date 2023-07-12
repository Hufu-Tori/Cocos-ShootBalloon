import { _decorator, CCString, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HomeSceneManager')
export class HomeSceneManager extends Component {

    @property
    public sceneName: string = "";

    play() {
        director.loadScene(this.sceneName);
    }
}


