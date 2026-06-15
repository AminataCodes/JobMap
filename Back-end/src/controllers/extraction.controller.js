import { ExtractionService } from "../services/extraction.service.js";

const extractionService = new ExtractionService();

export async function extractFromUrl(req, res) {
    try {
        const { url } = req.body;

        const result = await extractionService.extract(url);

        res.json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
}
