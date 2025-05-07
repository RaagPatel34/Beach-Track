"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ClassroomPage = () => {
    const { classroom } = useParams();
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/review`);  // Fetch all reviews
                const data = await res.json();

                // Filter only reviews for this specific classroom
                const filteredReviews = data.filter((review: any) => review.classroom === classroom);

                setReviews(filteredReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [classroom]);

    const calculateAverageRating = (reviews: any[]) => {
        if (!reviews || reviews.length === 0) return "No ratings";
        const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Classroom: {classroom}</h1>
            <h2>Average Rating: {calculateAverageRating(reviews)}</h2>

            <div style={{ marginTop: "20px" }}>
                {reviews.length > 0 ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px"
                    }}>
                        {reviews.map((review) => (
                            <div key={review._id} style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "15px",
                                backgroundColor: "#f9f9f9"
                            }}>
                                <p><strong>Rating:</strong> {review.rating}</p>
                                <p><strong>Comment:</strong> {review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews for this classroom yet.</p>
                )}
            </div>
        </div>
    );
};

export default ClassroomPage;