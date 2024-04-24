import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import fetchWithToken from "../../../Redux/interceptor";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import SingleNewConversation from "./SingleNewConversation";

const NewConversation = ({ setIsModalVisible }) => {
	const userId = useSelector((state) => state.auth.user.id);
	const token = useSelector((state) => state.auth.token);
	const [followers, setFollowers] = useState([]);
	const fetchLoggedUser = async () => {
		try {
			const response = await fetchWithToken(
				`https://localhost:7026/api/Followers/GetUserFollowing/${userId}`,
				token
			);
			const res = await response.json();
			if (response.ok) {
				console.log(res);
				setFollowers(res);
				return res;
			}
		} catch (error) {
			return console.log(error);
		}
	};
	useEffect(() => {
		fetchLoggedUser().then((res) => {
			console.log(res);
		});
	}, [userId, token]);

	return (
		<div>
			<div className="d-flex align-items-center">
				<h2>Start a new conversation</h2>
				<button
					onClick={() => {
						setIsModalVisible(false);
					}}
					className="btn btn-outline-highline rounded-cirlce ms-auto"
				>
					<FontAwesomeIcon icon={faX} />
				</button>
			</div>

			<div>
				{followers.map((follower) => (
					<SingleNewConversation key={follower.followerId} follower={follower} />
				))}
			</div>
		</div>
	);
};

export default NewConversation;
NewConversation.propTypes = {
	setIsModalVisible: PropTypes.func.isRequired,
};
