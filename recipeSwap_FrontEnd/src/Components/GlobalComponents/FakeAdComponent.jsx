// eslint-disable-next-line react/prop-types
const FakeAdComponent = () => {
	return (
		<div
			className="d-flex flex-column flex-md-row justify-content-between align-items-center p-2 rounded White shadow"
			style={{ width: "100%", height: "200px" }}
		>
			<div
				className="d-flex align-items-center justify-content-center bg-secondary text-white"
				style={{ width: "160px", height: "100%" }}
			>
				Ad Image
			</div>
			<div className="flex-grow-1 ms-3 me-3">
				<div className="font-weight-bold">Your Ad Headline</div>
				<div>
					<p>Here is a compelling message for your audience.</p>
				</div>
			</div>
			<button className="btn btn-primary">Call to Action</button>
		</div>
	);
};

export default FakeAdComponent;
