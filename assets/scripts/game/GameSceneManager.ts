import { _decorator, AudioClip, AudioSource, Camera, CCFloat, CCInteger, CCString, Component, director, EventKeyboard, game, geometry, Input, input, KeyCode, Label, Node, PhysicsSystem, screen } from 'cc';
import { Countdown } from './Countdown';
import EventManager from './EventManager';
import { GameEvent } from './GameEvent';
import { BalloonManager } from './BalloonManager';
import { Balloon } from './Balloon';
import { ScorePanel } from './ScorePanel';

const ray = new geometry.Ray();

const { ccclass, property } = _decorator;

@ccclass('GameSceneManager')
export class GameSceneManager extends Component {

    @property({ type: CCInteger })
    public gameTime: number = 60;

    @property({ type: CCFloat })
    public spawnInterval: number = 1.0;

    @property({ type: CCInteger })
    public spawnCount: number = 5;

    @property({ type: Node })
    public pauseUI: Node;

    @property({ type: Node })
    public gameHUD: Node;

    @property({ type: ScorePanel })
    public scorePanel: ScorePanel;

    @property({ type: Label })
    public scoreText: Label;

    @property({ type: Label })
    public remainingTimeText: Label;

    @property({ type: Camera })
    public camera: Camera;

    @property({ type: AudioClip })
    public blowUp: AudioClip;

    @property
    public homeSceneName: string = "";

    private audioSource: AudioSource;

    private countdown: Countdown;

    private balloonManager: BalloonManager;

    private isStarted: boolean = false;

    private remainingTime: number = 0;

    private balloonSpawnTime: number = 0;

    private score: number = 0;

    protected onLoad(): void {
        this.initEvents();
        this.audioSource = this.getComponent(AudioSource);
        this.countdown = this.getComponent(Countdown);
        this.balloonManager = this.getComponent(BalloonManager);

        input.on(Input.EventType.MOUSE_DOWN, (eventMouse) => {
            if (!document.pointerLockElement && !director.isPaused()) {
                game.canvas.requestPointerLock();
            }
        });
    }

    start() {
        this.countdown.run();
    }

    protected update(deltaTime: number) {
        if (!this.isStarted) {
            return;
        }

        if (this.remainingTime < 0) {

            if (this.balloonManager.activeCount == 0) {
                this.endGame();
            };

            return;
        }

        this.remainingTime -= deltaTime;

        if (this.remainingTime < this.balloonSpawnTime) {
            this.balloonSpawnTime -= this.spawnInterval;

            for (let i = 0; i < this.spawnCount; i++) {
                this.balloonManager.spawnBalloon();
            }
        }

        this.remainingTimeText.string = Math.ceil(this.remainingTime).toString();

    }

    private startGame() {
        this.balloonSpawnTime = this.gameTime;
        this.remainingTime = this.gameTime;

        this.remainingTimeText.string = Math.ceil(this.remainingTime).toString();
        this.gameHUD.active = true;

        this.isStarted = true;
    }

    private endGame() {
        this.isStarted = false;
        this.exitPointerLock();
        this.scorePanel.show(this.score);
    }

    private initEvents() {
        EventManager.on(GameEvent.COUNTDOWN_ENDS, () => {
            this.startGame();
        });

        EventManager.on(GameEvent.GAME_GO_HOME, () => {
            this.home();
        });

        input.on(Input.EventType.KEY_DOWN, (e: EventKeyboard) => {
            if (e.keyCode != KeyCode.TAB) {
                return;
            }

            this.exitPointerLock();

            director.isPaused() ? director.resume() : director.pause();
            this.pauseUI.active = director.isPaused();
        });

        input.on(Input.EventType.MOUSE_DOWN, (eventMouse) => {
            this.camera.screenPointToRay(screen.windowSize.width / 2, screen.windowSize.height / 2, ray);

            const mask = 0xffffffff;
            const maxDistance = 100;
            const queryTrigger = true;

            if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
                const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
                if (raycastClosestResult.collider.node.getComponent(Balloon)) {
                    this.hitBalloon(raycastClosestResult.collider.node);
                }
            }
        });
    }

    private hitBalloon(balloon: Node) {
        this.balloonManager.releaseBalloon(balloon);
        this.audioSource.playOneShot(this.blowUp);
        this.score++;
        this.scoreText.string = `擊中: ${this.score}`;
    }

    private home() {
        director.loadScene(this.homeSceneName);
    }

    private exitPointerLock() {
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        document.exitPointerLock();
    }

    private removeAllEvent() {
        EventManager.clear();
        input.off(Input.EventType.MOUSE_DOWN);
        input.off(Input.EventType.KEY_DOWN);
    }

    protected onDestroy(): void {
        this.removeAllEvent();
    }
}


