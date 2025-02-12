"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ShowClassrooms = () => {
    const [groupedReviews, setGroupedReviews] = useState<{ [key: string]: any[] }>({});
    const router = useRouter();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/review");
                const data = await res.json();

                const grouped = data.reduce((acc: any, review: any) => {
                    if (!acc[review.classroom]) {
                        acc[review.classroom] = [];
                    }
                    acc[review.classroom].push(review);
                    return acc;
                }, {});

                setGroupedReviews(grouped);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, []);

    const calculateAverageRating = (reviews: any[]) => {
        if (!reviews || reviews.length === 0) return "No ratings";
        const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                {Object.keys(groupedReviews).map((classroom) => (
                    <div 
                        key={classroom} 
                        style={{
                            border: "2px solid #007bff",
                            borderRadius: "8px",
                            padding: "20px",
                            backgroundColor: "#e9f5ff",
                            textAlign: "center",
                            fontWeight: "bold"
                        }}
                    >
                        <p>Classroom: {classroom}</p>
                        <p>Avg Rating: {calculateAverageRating(groupedReviews[classroom])}</p>
                        <button 
                            onClick={() => router.push(`/post-review/${classroom}`)} 
                            style={{
                                padding: "10px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            View Reviews
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowClassrooms;