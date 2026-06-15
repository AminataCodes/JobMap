import fs from "fs/promises";
import { CheerioExtractor } from "../extractors/cheerio.extractor.js";

export class ExtractionService {

    constructor() {
        this.extractor = new CheerioExtractor();
    }

    async extract(url) {

        const content = await this.extractor.extract(url);

        const extraction = {
            url,
            extractedAt: new Date().toISOString(),
            content
        };

        await this.saveExtraction(extraction);

        return extraction;
    }

    async saveExtraction(extraction) {

        const filePath = "./data/extractions.json";

        let data = [];

        try {
            const fileContent = await fs.readFile(filePath, "utf8");
            data = JSON.parse(fileContent);
        } catch {
            data = [];
        }

        data.push(extraction);

        await fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf8"
        );
    }
}