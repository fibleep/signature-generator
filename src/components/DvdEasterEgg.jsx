import { useEffect, useState } from "react";
import BouncingDvd from "./BouncingDvd";

/**
 * DVD Logo Easter Egg Component
 * @param {Object} props
 * @param {Array} props.people - Array of people objects with name and url
 * @param {string|null} props.selectedImageUrl - Initially selected profile image URL
 */
export default function DvdEasterEgg({ people, selectedImageUrl }) {
	const [isAnimating, setIsAnimating] = useState(false);
	const [animationImageUrl, setAnimationImageUrl] = useState(null);
	const [currentSelectedImageUrl, setCurrentSelectedImageUrl] = useState(selectedImageUrl);

	// Listen for changes to the selected profile picture URL
	useEffect(() => {
		const handleProfilePicChange = (event) => {
			setCurrentSelectedImageUrl(event.detail.url);
		};

		document.addEventListener("profilePicUrlChanged", handleProfilePicChange);

		return () => {
			document.removeEventListener("profilePicUrlChanged", handleProfilePicChange);
		};
	}, []);

	const handleDvdClick = () => {
		let imageUrl;

		// If there's a selected image, use it 50% of the time
		if (currentSelectedImageUrl && Math.random() > 0.5) {
			imageUrl = currentSelectedImageUrl;
		} else {
			// Otherwise, pick a random image from the people array
			const randomPerson = people[Math.floor(Math.random() * people.length)];
			imageUrl = randomPerson.url;
		}

		setAnimationImageUrl(imageUrl);
		setIsAnimating(true);
	};

	const stopAnimation = () => {
		setIsAnimating(false);
	};

	return (
		<>
			{/* DVD Logo */}
			<div
				onClick={handleDvdClick}
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					width: "50px",
					height: "50px",
					cursor: "pointer",
					opacity: 0.5,
					transition: "opacity 0.3s ease, transform 0.3s ease",
					zIndex: 100,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.opacity = "1";
					e.currentTarget.style.transform = "scale(1.1)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.opacity = "0.5";
					e.currentTarget.style.transform = "scale(1)";
				}}>
				<img
					src='/dvd.png'
					alt='DVD Logo'
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
					}}
				/>
			</div>

			{/* Bouncing Animation */}
			{isAnimating && animationImageUrl && (
				<BouncingDvd
					imageUrl={animationImageUrl}
					onClose={stopAnimation}
				/>
			)}
		</>
	);
}
