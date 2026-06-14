import { chromium } from "playwright";
import { BaseExtractor } from "./base.extractor.js";

export class PlaywrightExtractor extends BaseExtractor {

    async extract(url) {

        const browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "networkidle"
        });

        const text = await page.textContent("body");

        await browser.close();

        return text;
    }
}
