import { useState } from "react";
import { FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes, postRecipe } from "../../../../Redux/Slices/RecipesSlice"; // Update the import path as needed

import PropTypes from "prop-types";
const NewRecipe = ({ setOpenRecipe }) => {
	const token = useSelector((state) => state.auth.token);
	const userId = useSelector((state) => state.auth.user.id);
	const { isLoading } = useSelector((state) => state.recipes);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [ingredients, setIngredients] = useState("");
	const [steps, setSteps] = useState([""]);
	const [image, setImage] = useState(null);

	const dispatch = useDispatch();

	const addStep = () => setSteps([...steps, ""]);

	const updateStep = (index, value) => {
		const newSteps = [...steps];
		newSteps[index] = value;
		setSteps(newSteps);
	};

	const deleteStep = (index) => {
		const newSteps = [...steps];
		newSteps.splice(index, 1);
		setSteps(newSteps);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("UserId", userId.toString());
		formData.append("Title", title);
		formData.append("Description", description);
		formData.append("Ingredients", ingredients);
		formData.append("Instructions", steps.join("|||"));

		// Append the image file if selected
		if (image) {
			formData.append("Image", image);
		}

		// Adjust the action to handle FormData
		dispatch(postRecipe({ token, recipeData: formData }))
			.then(() => {
				// close the form after successful post
				setOpenRecipe(false);
				// Fetch updated recipes
			})
			.then(() => {
				dispatch(fetchRecipes(token));
				//reload page
			});
	};

	return (
		<div className="rounded-3 p-3 White shadow">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Title"
					className="form-control"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					placeholder="Description"
					className="form-control mt-2"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<textarea
					placeholder="Ingredients"
					className="form-control mt-2"
					value={ingredients}
					onChange={(e) => setIngredients(e.target.value)}
				/>

				{steps.map((step, index) => (
					<FormGroup key={index} className="mt-2">
						<label>Step {index + 1}</label>
						<div className="d-block d-lg-flex mt-2">
							<input
								type="text"
								placeholder="Add a new step"
								className="form-control me-lg-0"
								value={step}
								onChange={(e) => updateStep(index, e.target.value)}
							/>
							<button
								type="button"
								className="btn btn-outline-danger ms-2 mt-2 mt-lg-0"
								onClick={() => deleteStep(index)}
							>
								Delete
							</button>
						</div>
					</FormGroup>
				))}
				<div className="d-flex flex-column align-items-center justify-content-center">
					<button type="button" className="btn btn-outline-green mt-2 mx-auto" onClick={addStep}>
						Add Step
					</button>
					<input type="file" className="form-control mt-2" onChange={(e) => setImage(e.target.files[0])} />

					{/* <input type="file" className="form-control mt-2" /> Placeholder for future image upload */}
					<button type="submit" className="btn btn-outline-green mt-2">
						{isLoading ? "Loading..." : "Create Recipe"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewRecipe;

NewRecipe.propTypes = {
	setOpenRecipe: PropTypes.func.isRequired,
};
