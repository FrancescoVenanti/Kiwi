import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import imgPlaceholder from "../../../../assets/dishPlaceholder.webp";
import userPlaceholder from "../../../../assets/userPlaceholder.png";
import Comment from "./Comment";
import { useEffect } from "react";
import { fetchRecipes } from "../../../../Redux/Slices/RecipesSlice";
import Likes from "../../../GlobalComponents/Likes";
import FavoriteButton from "../../../GlobalComponents/FavoriteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import fetchWithToken from "../../../../Redux/interceptor";

const RecipeView = () => {
	const allRecipes = useSelector((state) => state.recipes.recipes);
	const token = useSelector((state) => state.auth.token);
	const queryId = window.location.pathname.split("/")[2];
	const recipe = allRecipes.find((recipe) => recipe.recipeId == queryId);
	const instructions = recipe.instructions.split("|||");
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchRecipes(token));
	}, [dispatch, token]);

	const deleteComment = async (commentId) => {
		try {
			const response = await fetchWithToken(`https://localhost:7026/api/comments/${commentId}`, token, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to delete comment");
			}
		} catch (error) {
			console.log("Error:", error);
		} finally {
			dispatch(fetchRecipes(token));
		}
	};

	return (
		<div className="text-center">
			<h2 className="display-4 text-green text-start me-3">{recipe.title}</h2>

			<div className="d-flex align-items-center">
				<div className=" ms-1 d-flex align-items-center mb-1 me-auto">
					<img
						src={recipe.user.profilePicture ? recipe.user.profilePicture : userPlaceholder}
						alt="user profile picture"
						className="img-fluid "
						style={{ width: "36px", height: "36px", borderRadius: "50%" }}
					/>

					<p className="m-0 ms-2 fs-5 me-2">{recipe.user.username}</p>
					{recipe.user.userId !== user.id && <FontAwesomeIcon icon={faUserPlus} />}
				</div>
				<Likes recipe={recipe} />
				<FavoriteButton recipe={recipe} />
			</div>
			<div className="shadow overflow-hidden w-100 rounded-3 mt-2">
				<motion.img
					src={recipe.image == "" ? imgPlaceholder : recipe.image}
					alt={recipe.title}
					className="img-fluid w-100"
					style={{ aspectRatio: "16/9", objectFit: "cover" }}
					whileHover={{ scale: 1.5 }} // Adjust scale value as needed
					transition={{ duration: 0.3 }}
				/>
			</div>
			<p className="text-bgLight mt-3 fs-5">{recipe.description}</p>
			<p className="text-beige mt-3 lead">Ingredients: {recipe.ingredients}</p>
			<div className="text-start mt-4">
				<h3 className="text-green ">Instructions</h3>
				<ul className="text-start">
					{instructions.map((instruction, index) => (
						<li key={index} className="fs-5 mt-2">
							{instruction}
						</li>
					))}
				</ul>
			</div>
			<div className="d-flex justify-content-center">
				<div className="text-start mt-4 comments ">
					<h3 className="text-green text-center">Comments</h3>
					{recipe.comments &&
						recipe.comments.map((comment, index) => (
							<div key={index} className=" mt-2 White px-2 py-1 rounded-2">
								{user.id !== comment.userId ? (
									<div className="d-flex align-items-center ">
										<img
											src={
												comment.profilePicture == null
													? userPlaceholder
													: comment.profilePicture
											}
											alt={comment.username}
											className="rounded-circle"
											style={{ width: "30px" }}
										/>
										<p className="text-beige m-0 ms-2 ">{comment.username}</p>
										{user.role == "admin" && (
											<FontAwesomeIcon
												className="text-highlight ms-2"
												icon={faTrash}
												onClick={() => deleteComment(comment.commentId)}
											/>
										)}
									</div>
								) : (
									<div className="d-flex align-items-center justify-content-end">
										{user.role == "admin" && (
											<FontAwesomeIcon
												className="text-highlight me-2"
												icon={faTrash}
												onClick={() => deleteComment(comment.commentId)}
											/>
										)}
										<p className="text-beige m-0 me-2">You</p>
									</div>
								)}
								<div
									className={`d-flex  ${
										user.id == comment.userId && "justify-content-end align-items-center"
									}`}
								>
									<p
										className={`p-2 m-0 rounded-2 White w-100 ${
											user.id == comment.userId && " text-end"
										}`}
									>
										{comment.comment1}
									</p>
								</div>
							</div>
						))}
					<div className="my-3">
						<Comment userId={user.id} recipeId={recipe.recipeId} />
					</div>
				</div>
			</div>
		</div>
	);
};
export default RecipeView;
