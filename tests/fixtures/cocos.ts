import { JSHandle, Page, test as base } from "@playwright/test";

class Cocos {
	constructor(private readonly page: Page) { }

	public async waitForSceneLoading(): Promise<void> {
		await this.page.evaluate(() => {
			return new Promise<void>((resolve) => {
				const sceneLoaded = () => {
					if (typeof cc === "undefined") {
						return false;
					}

					const scene = cc.director.getScene();
					return Boolean(scene);
				};

				const resolveIfSceneLoaded = () => {
					if (sceneLoaded()) {
						resolve();
						clearInterval(interval);
					}
				};

				const interval = setInterval(resolveIfSceneLoaded, 10);
			});
		});
	}

	public async getSceneName(): Promise<string> {
		return this.page.evaluate(() => { return cc.director.getScene()?.name; });
	}

	public async focus(): Promise<void> {
		return this.page.evaluate(() => { cc.game.canvas.focus(); });
	}

	public async getNodeActive(path: string): Promise<boolean> {
		return this.page.evaluate((path) => {
			return !!cc.director.getScene().getChildByPath(path)?.active;
		}, path);
	}
}

export const test = base.extend<{ cocos: Cocos }>({ cocos: ({ page }, use) => use(new Cocos(page)) });