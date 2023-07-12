import { _decorator, CCFloat, Component, director, instantiate, Node, NodePool, Prefab, randomRange, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BalloonManager')
export class BalloonManager extends Component {

    @property({ type: Prefab })
    public balloonPrefab!: Prefab;

    @property({ type: CCFloat })
    public yMax: number = 5.0;

    @property({ type: CCFloat })
    private yMin: number = -5.0;

    private radius: number = 5.0;

    private balloonPool: NodePool = new NodePool();

    private balloons: Array<Node> = [];

    private scene!: Scene;

    protected onLoad(): void {
        this.scene = director.getScene();
    }

    public spawnBalloon() {

        const balloon = this.balloonPool.size() > 0 ? this.balloonPool.get()! : instantiate(this.balloonPrefab)!;

        const rad = randomRange(0, 360) * Math.PI / 180;
        const x = this.radius * Math.cos(rad);
        const z = this.radius * Math.sin(rad);

        balloon.setParent(this.scene);
        balloon.setPosition(x, this.yMin, z);

        this.balloons.push(balloon);
    }

    protected update(dt: number): void {
        if (this.balloons.length > 0) {
            for (let i = this.balloons.length - 1; i >= 0; i--) {
                const balloon = this.balloons[i];

                if (balloon.position.y > this.yMax) {
                    this.releaseBalloon(balloon);
                }
            }
        }
    }

    public releaseBalloon(balloon: Node) {
        const index = this.balloons.indexOf(balloon)

        if (index < 0) {
            return;
        }

        this.balloons.splice(index, 1);
        this.balloonPool.put(balloon);
    }


    public get activeCount(): number {
        return this.balloons.length
    }

}


