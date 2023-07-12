import { _decorator, CCFloat, Color, Component, Enum, MeshRenderer, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum BallonType {
    Red,
    Blue,
    Yellow
}

Enum(BallonType);

@ccclass('Balloon')
export class Balloon extends Component {

    @property({ type: CCFloat })
    public speed: number = 1.0;

    @property({ type: MeshRenderer })
    public balloonRenderer: MeshRenderer;

    // private _type: BallonType = BallonType.Red;

    // @property({ type: BallonType })
    // public set type(v: BallonType) {
    //     this._type = v;

    //     let scale = 1;
    //     let color = Color.BLUE;

    //     if (this.type == BallonType.Red) {
    //         scale = 4;
    //         color = Color.RED;
    //     }
    //     else if (this.type == BallonType.Yellow) {
    //         scale = 0.75;
    //         color = Color.YELLOW;
    //     }

    //     this.node.setScale(new Vec3(Vec3.ONE).multiplyScalar(scale));
    //     this.setColor(color);
    // }

    // public get type(): BallonType {
    //     return this._type;
    // }

    public setColor(color: Color) {
        if (this.balloonRenderer) {
            this.balloonRenderer.material.setProperty('diffuseColor', color);
        }
    }

    protected update(dt: number): void {
        this.node.setPosition(this.node.position.x, this.node.position.y + this.speed * dt);
    }

}