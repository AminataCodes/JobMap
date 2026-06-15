import axios from "axios";
import * as cheerio from "cheerio";
import { BaseExtractor } from "./base.extractor.js";

export class CheerioExtractor extends BaseExtractor {

    async extract(url) {

        const response = await axios.get(url);

        const $ = cheerio.load(response.data);

        $("script").remove();
        $("style").remove();

        const text = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        return text;
    }
}
