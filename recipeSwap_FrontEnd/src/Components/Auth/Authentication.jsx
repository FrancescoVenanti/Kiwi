import Register from "./Register";
import Login from "./Login";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const Authentication = ({ setIsLogged }) => {
	const [accedi, setAccedi] = useState(true);

	return (
		<div className="divAuth position-relative">
			<div className="d-flex flex-column justify-content-center registerPos">
				{accedi ? <Login setIsLogged={setIsLogged} /> : <Register />}
				<div className="d-flex align-items-center bg-white rounded-2 mt-2">
					{accedi ? (
						<p className="m-0 p-2">You dont have an ccount?</p>
					) : (
						<p className="m-0 p-2">You already have an account?</p>
					)}
					<button
						className="fw-bold fs-4 border-0 m-0 p-2 bg-transparent text-dark"
						onClick={() => setAccedi(!accedi)}
					>
						{accedi ? "Register" : "Login"}
					</button>
				</div>
			</div>
		</div>
	);
};
export default Authentication;
