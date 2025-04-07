import { useEffect, useRef } from "react";

/**
 * BouncingDvd Component - Creates a bouncing image animation similar to the DVD logo
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the image to bounce around
 * @param {Function} props.onClose - Callback when animation is stopped
 */
export default function BouncingDvd({ imageUrl, onClose }) {
	// Use refs for DOM elements
	const containerRef = useRef(null);
	const imageRef = useRef(null);

	// Use refs for animation state instead of React state for smoother animation
	const positionRef = useRef({ x: 100, y: 100 });
	const velocityRef = useRef({ x: 3, y: 3 });
	const dimensionsRef = useRef({ width: 100, height: 100 });
	const animationRef = useRef(null);
	const colorsRef = useRef([
		"#ff0000", // red
		"#ff7f00", // orange
		"#ffff00", // yellow
		"#00ff00", // green
		"#0000ff", // blue
		"#4b0082", // indigo
		"#9400d3", // violet
		"#ff00ff", // magenta
		"#00ffff", // cyan
	]);
	const currentColorRef = useRef(Math.floor(Math.random() * colorsRef.current.length));

	// Initialize and start animation
	useEffect(() => {
		// Set initial position to a random spot on the screen
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		positionRef.current = {
			x: Math.random() * (screenWidth - 150),
			y: Math.random() * (screenHeight - 150),
		};

		// Set initial velocity - random direction
		const speed = 3;
		const angle = Math.random() * 2 * Math.PI;
		velocityRef.current = {
			x: Math.cos(angle) * speed,
			y: Math.sin(angle) * speed,
		};

		// Get actual dimensions of the image
		if (imageRef.current) {
			// Start with default and update after image load
			dimensionsRef.current = {
				width: 100,
				height: 100,
			};

			// Update dimensions when image loads
			imageRef.current.onload = () => {
				dimensionsRef.current = {
					width: imageRef.current.offsetWidth,
					height: imageRef.current.offsetHeight,
				};
			};
		}

		// Start animation
		animationRef.current = requestAnimationFrame(updatePosition);

		// Setup ESC key handler
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				stopAnimation();
			}
		};
		window.addEventListener("keydown", handleKeyDown);

		// Cleanup
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	const updatePosition = () => {
		// Destructure for clarity
		const { x, y } = positionRef.current;
		const { x: vx, y: vy } = velocityRef.current;
		const { width, height } = dimensionsRef.current;

		// Calculate new position
		let newX = x + vx;
		let newY = y + vy;
		let newVx = vx;
		let newVy = vy;
		let colorChanged = false;

		// Check for collisions with window edges
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// Bounce logic - left/right edges
		if (newX <= 0 || newX + width >= screenWidth) {
			newVx = -vx; // Reverse x direction
			if (newX <= 0) newX = 0; // Left edge
			else newX = screenWidth - width; // Right edge
			colorChanged = true;
		}

		// Bounce logic - top/bottom edges
		if (newY <= 0 || newY + height >= screenHeight) {
			newVy = -vy; // Reverse y direction
			if (newY <= 0) newY = 0; // Top edge
			else newY = screenHeight - height; // Bottom edge
			colorChanged = true;
		}

		// Update refs with new values
		positionRef.current = { x: newX, y: newY };
		velocityRef.current = { x: newVx, y: newVy };

		// Change color on collision
		if (colorChanged && imageRef.current) {
			currentColorRef.current = (currentColorRef.current + 1) % colorsRef.current.length;
			imageRef.current.style.boxShadow = `0 0 20px ${colorsRef.current[currentColorRef.current]}`;
		}

		// Update DOM directly for smoother animation
		if (imageRef.current) {
			imageRef.current.style.left = `${newX}px`;
			imageRef.current.style.top = `${newY}px`;
		}

		// Continue animation
		animationRef.current = requestAnimationFrame(updatePosition);
	};

	const stopAnimation = () => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		onClose();
	};

	return (
		<div
			ref={containerRef}
			onClick={stopAnimation}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				zIndex: 9999,
				cursor: "pointer",
				backgroundColor: "rgba(0, 0, 0, 0.8)",
			}}>
			<div
				style={{
					position: "absolute",
					top: "20px",
					left: 0,
					width: "100%",
					textAlign: "center",
					color: "white",
					fontSize: "16px",
					padding: "10px",
				}}>
				Click anywhere or press ESC to exit
			</div>

			<img
				ref={imageRef}
				src={imageUrl}
				alt='Bouncing DVD Logo'
				style={{
					position: "absolute",
					left: `${positionRef.current.x}px`,
					top: `${positionRef.current.y}px`,
					width: "100px",
					height: "100px",
					objectFit: "cover",
					borderRadius: "50%",
					boxShadow: `0 0 20px ${colorsRef.current[currentColorRef.current]}`,
				}}
			/>
		</div>
	);
}
