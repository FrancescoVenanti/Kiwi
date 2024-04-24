import { useState } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../../../Redux/Slices/messagesSlice";

const SingleNewConversation = ({ follower }) => {
	console.log(follower);
	const [showInput, setShowInput] = useState(false);

	const [messageText, setMessageText] = useState("");
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const userId = useSelector((state) => state.auth.user.id);

	const handleSendMessage = (event) => {
		event.preventDefault();
		if (!messageText.trim()) return; // Prevent sending empty messages

		const message = {
			SenderUserId: userId,
			ReceiverUserId: follower.followedUserId,
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

	return (
		<div className="border my-2 p-2 rounded-2 justify-content-start White">
			<div
				key={follower.followerId}
				className="d-flex align-items-center "
				onClick={() => {
					setShowInput(!showInput);
				}}
			>
				<img
					src={follower.followedUser.profilePicture}
					alt="profile"
					className="rounded-circle me-2"
					style={{ width: "50px", aspectRatio: "1" }}
				/>
				<p className="m-0 fs-4">{follower.followedUser.username}</p>
			</div>
			<div>
				{showInput && (
					<div className="d-flex mt-2">
						<input
							type="text"
							placeholder="Type your message"
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							className="form-control me-2"
						/>
						<button className="btn btn-outline-green" onClick={handleSendMessage}>
							Send
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SingleNewConversation;

SingleNewConversation.propTypes = {
	follower: PropTypes.object.isRequired,
};
