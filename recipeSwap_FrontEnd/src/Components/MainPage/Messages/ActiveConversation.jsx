import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../../../Redux/Slices/messagesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const ActiveConversation = ({ activeConversation, userId, closeConversation, setIsMessageListVisible }) => {
	const [messageText, setMessageText] = useState("");
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	const handleSendMessage = (event) => {
		event.preventDefault();
		if (!messageText.trim()) return; // Prevent sending empty messages

		const message = {
			SenderUserId: userId,
			ReceiverUserId:
				activeConversation[0].senderUserId === userId
					? activeConversation[0].receiverUserId
					: activeConversation[0].senderUserId,
			MessageContent: messageText,
		};

		dispatch(sendMessage({ message, token }))
			.then(() => {
				dispatch(fetchMessages({ userId, token })); // Fetch messages after sending
			})
			.catch((err) => {
				console.error(err);
			});

		setMessageText(""); // Clear the input after sending
	};

	if (!activeConversation) return null;

	return (
		<div>
			<div className="d-flex align-items-center mb-2 p-2 rounded-2 border-bottom border-dark sticky-top White">
				<img
					src={
						activeConversation[0].senderUserId === userId
							? activeConversation[0].receiverUser.profilePicture
							: activeConversation[0].senderUser.profilePicture
					}
					alt="profile"
					className="rounded-circle me-2"
					style={{ width: "50px", height: "50px" }}
				/>
				<h2>
					{activeConversation[0].senderUserId === userId
						? activeConversation[0].receiverUser.username
						: activeConversation[0].senderUser.username}
				</h2>
				<button
					onClick={() => {
						closeConversation();
						setIsMessageListVisible(true);
					}}
					className="btn btn-outline-highline rounded-cirlce ms-auto"
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>

			{activeConversation.map((msg) => (
				<div
					key={msg.messageId}
					className={`row ${
						msg.senderUserId === userId ? "justify-content-end" : "justify-content-start"
					} mb-2`}
				>
					<div className="col-auto">
						<p
							className={`m-0 rounded-pill py-2 px-4 ${
								msg.senderUserId === userId ? "bg-green text-white" : "White"
							}`}
						>
							{msg.messageContent}
						</p>
					</div>
				</div>
			))}

			<form onSubmit={handleSendMessage} className="mt-3 d-flex">
				<button type="submit" className="btn btn-outline-green rounded-3">
					Send
				</button>
				<input
					type="text"
					className="form-control ms-2"
					placeholder="Type a message..."
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
				/>
			</form>
		</div>
	);
};

ActiveConversation.propTypes = {
	activeConversation: PropTypes.array,
	userId: PropTypes.number.isRequired,
	closeConversation: PropTypes.func.isRequired,
	setIsMessageListVisible: PropTypes.func.isRequired,
};

export default ActiveConversation;
