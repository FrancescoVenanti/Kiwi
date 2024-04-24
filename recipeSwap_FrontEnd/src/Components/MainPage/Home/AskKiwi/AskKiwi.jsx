import { useState } from "react";

const AskKiwi = () => {
	const [input, setInput] = useState("");
	const [conversation, setConversation] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleQuestionSubmit = async () => {
		try {
			setLoading(true); // Set loading state to true

			const newQuestion = { question: input }; // Store the question before the response

			const response = await fetch("http://localhost:3001/api/question", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: input }),
			});

			if (response.ok) {
				const data = await response.json();
				newQuestion.answer = data.answer; // Update the answer for the question
				setConversation([...conversation, newQuestion]); // Update the conversation with the question and answer
				setInput(""); // Clear input after submitting
			} else {
				console.error("Failed to submit question:", response.statusText);
			}
		} catch (error) {
			console.error("Error processing question:", error);
		} finally {
			setLoading(false); // Set loading state back to false after receiving the response
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="text-green display-2 mb-4">Ask Kiwi</h2>
			<div className="row">
				<div className="col-12">
					{conversation.map((pair, index) => (
						<div key={index} className="row g-2 mb-3 fs-5">
							<div className=" col-10 offset-2 text-right d-flex justify-content-end">
								<div className="p-3 bg-green text-white rounded">{pair.question}</div>
							</div>
							<div className="col-10 d-flex justify-content-start">
								<div className=" p-3 White rounded">
									<pre>{pair.answer}</pre>
								</div>
							</div>
						</div>
					))}
					{loading && (
						<div className="row g-2 mb-3">
							<div className="col-10 offset-2 text-right d-flex justify-content-end">
								<div className="p-3 bg-green text-white rounded ">Loading...</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Ask a question..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button className="btn btn-primary" onClick={handleQuestionSubmit}>
							Ask
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default AskKiwi;
