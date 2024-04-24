import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../../Redux/Slices/messagesSlice";
import ActiveConversation from "./ActiveConversation";
import ConversationList from "./ConversationList";
import NewConversation from "./NewConversation";

const Messages = () => {
	const [activeConversationKey, setActiveConversationKey] = useState(null);
	const [isMessageListVisible, setIsMessageListVisible] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const dispatch = useDispatch();
	const messages = useSelector((state) => state.messages.items);
	const loading = useSelector((state) => state.messages.loading);
	const error = useSelector((state) => state.messages.error);
	const userId = useSelector((state) => state.auth.user.id);
	const token = useSelector((state) => state.auth.token);

	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [activeConversationKey]);

	useEffect(() => {
		dispatch(fetchMessages({ userId, token }));
	}, [dispatch, userId, token]);

	const groupedMessages = messages.reduce((acc, message) => {
		const key = [message.senderUserId, message.receiverUserId].sort().join("-");
		acc[key] = acc[key] || [];
		acc[key].push(message);
		return acc;
	}, {});

	const conversations = Object.entries(groupedMessages).map(([key, messages]) => ({
		key,
		messages,
		lastMessage: messages[messages.length - 1],
	}));

	const closeActiveConversation = () => {
		setActiveConversationKey(null);
	};

	return (
		<div className="container">
			<div className="row">
				<h1 className="text-green">Messages</h1>
				<div className={`col-12 col-lg-4 d-lg-block scrollable ${isMessageListVisible ? "d-block" : "d-none"}`}>
					<ConversationList
						conversations={conversations}
						setActiveConversation={setActiveConversationKey}
						setIsMessageListVisible={setIsMessageListVisible}
						loading={loading}
						error={error}
						userId={userId}
						setIsModalVisible={setIsModalVisible}
						closeActiveConversation={closeActiveConversation}
					/>
				</div>
				<div className={`col-12 col-lg-8 scrollable ${isModalVisible ? "d-lg-block" : "d-none"}`}>
					<NewConversation setIsModalVisible={setIsModalVisible} />
				</div>

				<div className="col-12 col-lg-8 scrollable" ref={scrollRef}>
					<ActiveConversation
						activeConversation={activeConversationKey ? groupedMessages[activeConversationKey] : null}
						setIsMessageListVisible={setIsMessageListVisible}
						userId={userId}
						setIsModalVisible={setIsModalVisible}
						closeConversation={closeActiveConversation}
					/>
				</div>
			</div>
		</div>
	);
};

export default Messages;
