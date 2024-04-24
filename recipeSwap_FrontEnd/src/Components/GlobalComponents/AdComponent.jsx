import { useEffect } from "react";

const AdComponent = () => {
	useEffect(() => {
		// Check if the adsbygoogle script is already loaded
		const isScriptLoaded = !!window.adsbygoogle;

		// Load the adsbygoogle script if it's not already loaded
		if (!isScriptLoaded) {
			const script = document.createElement("script");
			script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			script.async = true;
			script.crossOrigin = "anonymous";
			document.body.appendChild(script);
		}

		// Initialize the ad
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {
			console.error(e);
		}
	}, []);

	return (
		<ins
			className="adsbygoogle"
			style={{ display: "block" }}
			data-ad-client="ca-pub-7424029032152065"
			data-ad-slot="8918073430"
			data-ad-format="auto"
			data-full-width-responsive="true"
		></ins>
	);
};
export default AdComponent;
