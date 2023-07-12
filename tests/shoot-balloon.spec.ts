import { expect } from '@playwright/test';
import { test } from './fixtures/cocos';

test.describe("shoot-balloon", () => {

	test("test game pasue", async ({ page, cocos }) => {

		await page.goto('http://localhost:7457/');

		await cocos.waitForSceneLoading();
		await cocos.focus();

		const sceneName = await cocos.getSceneName();
		expect(sceneName).toBe("GameScene");

		expect(await cocos.getNodeActive("Canvas/PauseUI")).toBe(false);
		await page.keyboard.down("Tab");
		expect(await cocos.getNodeActive("Canvas/PauseUI")).toBe(true);

	});
})