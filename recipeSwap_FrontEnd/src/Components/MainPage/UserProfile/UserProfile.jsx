import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import SingleRecipe from "../Home/SingleRecipe/SingleRecipe";
import { fetchUserWithRecipes } from "../../../Redux/Slices/usersSlice"; // Adjust imports as necessary
import { updateUserProfilePicture } from "../../../Redux/Slices/authSlice";

const UserProfile = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const authUserId = useSelector((state) => state.auth.user.id);
	const userProfilePic = useSelector((state) => state.auth.user.profilePicture);

	useEffect(() => {
		// Fetch user data based on the id parameter
		dispatch(fetchUserWithRecipes({ userId: id, token }));
	}, [id, dispatch, token, userProfilePic]);

	const fetchedUserData = useSelector((state) => state.user.userDetails); // Adjust based on where you store fetched user data

	const [isFollowed, setIsFollowed] = useState(
		fetchedUserData.following.some((following) => following.followedUserId == id)
	);

	const fileInputRef = useRef(null);

	const handleProfilePictureClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("image", file); // Adjust the key according to your backend expectations

		// Dispatch the thunk with formData
		dispatch(updateUserProfilePicture(formData)); // Now just passing formData directly
		//reload everything
	};

	const followUnfollow = async () => {
		try {
			const response = await fetch(
				`https://localhost:7026/api/Followers/followUnfollow/?followerId=${authUserId}&followedId=${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response;

			if (!response.ok) {
				throw new Error(data.message || "error");
			}
			setIsFollowed(!isFollowed);
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const defaultProfilePicture = "https://via.placeholder.com/300";

	return (
		<div>
			{/* User info and image */}
			<div className="d-flex flex-column flex-md-row align-items-center d-md-flex">
				<div
					className={`mx-auto ${
						authUserId != id && "d-flex align-items-center flex-wrap justify-content-start "
					}`}
				>
					<h5 className="display-4 text-green me-3">{fetchedUserData.username}</h5>
					{authUserId == id ? (
						<>
							<p>
								Name: {fetchedUserData.firstName} {fetchedUserData.lastName}
							</p>

							<p>Kiwi member since: {fetchedUserData.registrationDate}</p>
							<p className={fetchedUserData.verifiedEmail ? "text-green" : "text-highlight"}>
								Email: {fetchedUserData.email}
							</p>
							<p>
								Password: ******** <FontAwesomeIcon icon={faPencil} />
							</p>
						</>
					) : !isFollowed ? (
						<button className="btn btn-outline-green" onClick={followUnfollow}>
							Follow
						</button>
					) : (
						<button className="btn btn-outline-highline" onClick={followUnfollow}>
							Stop Following
						</button>
					)}
				</div>

				<img
					src={fetchedUserData.profilePicture || defaultProfilePicture}
					className="ms-md-auto mx-auto mx-md-0 mt-3 img-fluid rounded-circle order-last order-md-first mb-3 mb-md-0 border border-3 border-green"
					alt="Profile"
					onClick={authUserId == id ? handleProfilePictureClick : null}
					style={{
						cursor: "pointer",
						maxWidth: "200px",
						maxHeight: "200px",
						aspectRatio: "1/1",
						objectFit: "cover",
					}}
				/>
				<input
					type="file"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleFileChange}
					accept="image/*"
				/>
			</div>

			{/* Recipes */}
			<div className="mt-4 text-center">
				<h4 className="text-green">Latest recipes</h4>
				<div className="row g-2">
					{fetchedUserData.recipes.map((recipe) => (
						<div key={recipe.recipeId} className="col-12 text-start">
							<SingleRecipe recipe={recipe} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
