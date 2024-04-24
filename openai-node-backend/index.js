import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors()); // Use this before your routes are defined
const port = 3001;

app.use(bodyParser.json());

const openai = new OpenAI({
	apiKey: "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",
});

app.post("/api/question", async (req, res) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are a cooking assistant, only answering questions related to kitchen and cooking. your answers should have no more than 200 words. try to be friendly. if asked for a recipe, provide a step by step answer. You're on a recipe website, so in the end you shortly suggest the user to check the recipe section.",
				},
				{ role: "user", content: req.body.question },
			],
		});

		console.log("OpenAI Response:", response);

		// Check if the response from OpenAI contains the expected structure
		if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
			console.log("Message:", response.choices[0].message);
			const answer = response.choices[0].message.content.trim(); // Update to access the 'content' property
			res.json({ answer });
		} else {
			throw new Error("Invalid response format from OpenAI API");
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Error processing your question");
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
