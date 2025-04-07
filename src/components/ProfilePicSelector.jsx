import { useEffect, useState } from "react";

const styles = {
	profileSelector: {
		position: "relative",
	},
	buttonContainer: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
	},
	thumbnail: {
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		objectFit: "cover",
	},
	button: {
		padding: "8px 15px",
		backgroundColor: "#5bc0de",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		transition: "background-color 0.2s ease",
	},
	buttonHover: {
		backgroundColor: "#46b8da",
	},
	modalOverlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000,
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: "8px",
		padding: "20px",
		width: "80%",
		maxWidth: "800px",
		maxHeight: "80vh",
		overflowY: "auto",
		position: "relative",
	},
	closeButton: {
		position: "absolute",
		top: "10px",
		right: "15px",
		fontSize: "24px",
		background: "none",
		border: "none",
		cursor: "pointer",
		color: "#aaa",
	},
	modalHeading: {
		textAlign: "center",
		marginTop: 0,
		marginBottom: "20px",
	},
	galleryGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
		gap: "15px",
	},
	galleryItem: {
		cursor: "pointer",
		textAlign: "center",
		padding: "10px",
		border: "2px solid transparent",
		borderRadius: "8px",
		transition: "all 0.2s ease",
	},
	galleryItemHover: {
		backgroundColor: "#f5f5f5",
	},
	galleryItemSelected: {
		borderColor: "#7f33c7",
		backgroundColor: "#f0e6ff",
	},
	galleryImage: {
		width: "80px",
		height: "80px",
		objectFit: "cover",
		borderRadius: "50%",
		marginBottom: "8px",
	},
	personName: {
		display: "block",
		fontSize: "12px",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
};

/**
 * Profile Picture Selector Component
 *
 * @param {Object} props
 * @param {Array} props.people - Array of people objects with name and url
 */
export default function ProfilePicSelector({ people }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPic, setSelectedPic] = useState(null);
	const [hoveredButtonId, setHoveredButtonId] = useState(null);
	const [hoveredItemId, setHoveredItemId] = useState(null);

	// Update hidden input when selection changes
	useEffect(() => {
		if (selectedPic) {
			const hiddenInput = document.getElementById("profilePicUrl");
			if (hiddenInput) {
				hiddenInput.value = selectedPic.url;
				// Dispatch an event to notify the Astro script about the change
				hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
			}
		}
	}, [selectedPic]);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handlePicSelect = (person) => {
		setSelectedPic(person);
		closeModal();
	};

	// Prevent modal content clicks from closing the modal
	const handleModalContentClick = (e) => {
		e.stopPropagation();
	};

	return (
		<div style={styles.profileSelector}>
			<div style={styles.buttonContainer}>
				{selectedPic && (
					<img
						src={selectedPic.url}
						alt={selectedPic.name}
						style={styles.thumbnail}
					/>
				)}
				<button
					type='button'
					onClick={openModal}
					style={{
						...styles.button,
						...(hoveredButtonId === "select-btn" ? styles.buttonHover : {}),
					}}
					onMouseEnter={() => setHoveredButtonId("select-btn")}
					onMouseLeave={() => setHoveredButtonId(null)}>
					{selectedPic ? "Change Picture" : "Choose Picture"}
				</button>
			</div>

			{isModalOpen && (
				<div
					style={styles.modalOverlay}
					onClick={closeModal}>
					<div
						style={styles.modalContent}
						onClick={handleModalContentClick}>
						<button
							type='button'
							style={styles.closeButton}
							onClick={closeModal}>
							&times;
						</button>
						<h2 style={styles.modalHeading}>Select Profile Picture</h2>
						<div style={styles.galleryGrid}>
							{people.map((person) => (
								<div
									key={person.name}
									style={{
										...styles.galleryItem,
										...(hoveredItemId === person.name ? styles.galleryItemHover : {}),
										...(selectedPic?.name === person.name ? styles.galleryItemSelected : {}),
									}}
									onMouseEnter={() => setHoveredItemId(person.name)}
									onMouseLeave={() => setHoveredItemId(null)}
									onClick={() => handlePicSelect(person)}>
									<img
										src={person.url}
										alt={person.name}
										style={styles.galleryImage}
									/>
									<span style={styles.personName}>{person.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
