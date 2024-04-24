import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasFaHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farFaHeart } from "@fortawesome/free-regular-svg-icons";

import PropTypes from "prop-types";

const Likes = ({ recipe }) => {
	const userId = useSelector((state) => state.auth.user.id);

	const [isLiked, setIsLiked] = useState(
		Array.isArray(recipe.likes) ? recipe.likes.some((like) => like.userId === userId) : false
	);

	const [animate, setAnimate] = useState(false);
	const token = useSelector((state) => state.auth.token);
	const [totLikes, setTotLikes] = useState(recipe.likesCount);

	const handleLike = async () => {
		// Trigger animation
		setAnimate(true);
		setTimeout(() => setAnimate(false), 400); // Duration should match CSS animation

		try {
			const response = await fetch(
				`https://localhost:7026/api/Likes/?userId=${userId}&ProductId=${recipe.recipeId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Could not toggle like");
			}
			setIsLiked(!isLiked);
			if (data.message === "Like rimosso.") {
				setTotLikes(totLikes - 1);
			} else {
				setTotLikes(totLikes + 1);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	return (
		<div className="d-flex align-items-center me-3">
			<button className="btn bg-transparent text-green p-1" onClick={handleLike}>
				<FontAwesomeIcon
					icon={isLiked ? fasFaHeart : farFaHeart}
					className={`fs-4 text-highlight ${animate ? "heart-pop" : ""}`}
				/>
			</button>
			<p className="m-0 fs-5 white">{totLikes}</p>
		</div>
	);
};

Likes.propTypes = {
	recipe: PropTypes.object.isRequired,
};

export default Likes;
