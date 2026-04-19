import { useState } from "react";

interface FeedbackForm {
    studentName: string;
    course: string;
    rating: string;
    comments: string;
}

const COURSES = [
    "Applications Development 1",
    "Database Programming",
    "Computer Networks",
    "Web Development",
    "Software Engineering",
];

export default function Feedback() {
    const [form, setForm] = useState<FeedbackForm>({
        studentName: "",
        course: "",
        rating: "",
        comments: "",
    });

    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = (): boolean => {
        if (!form.studentName.trim()) { setError("Student name is required."); return false; }
        if (!form.course) { setError("Please select a course."); return false; }
        if (!form.rating) { setError("Please select a rating."); return false; }
        if (Number(form.rating) < 1 || Number(form.rating) > 5) { setError("Rating must be between 1 and 5."); return false; }
        if (!form.comments.trim()) { setError("Comments are required."); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setStatus("");

        if (!validate()) return;

        try {
            const response = await fetch("http://localhost:5000/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, rating: Number(form.rating) }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(data.message || "Feedback submitted successfully!");
                setForm({ studentName: "", course: "", rating: "", comments: "" });
            } else {
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            setError("Could not connect to the server. Make sure the backend is running.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
            <h2>Course Feedback System</h2>

            {status && <p style={{ color: "green" }}>{status}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* Student Name */}
                <div style={{ marginBottom: "12px" }}>
                    <label>Student Name</label><br />
                    <input
                        type="text"
                        name="studentName"
                        value={form.studentName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                {/* Course Dropdown */}
                <div style={{ marginBottom: "12px" }}>
                    <label>Course</label><br />
                    <select
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">-- Select a Course --</option>
                        {COURSES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Rating Radio Buttons */}
                <div style={{ marginBottom: "12px" }}>
                    <label>Rating (1–5)</label><br />
                    {[1, 2, 3, 4, 5].map((r) => (
                        <label key={r} style={{ marginRight: "12px" }}>
                            <input
                                type="radio"
                                name="rating"
                                value={r}
                                checked={form.rating === String(r)}
                                onChange={handleChange}
                            />
                            {" "}{r}
                        </label>
                    ))}
                </div>

                {/* Comments */}
                <div style={{ marginBottom: "12px" }}>
                    <label>Comments</label><br />
                    <textarea
                        name="comments"
                        value={form.comments}
                        onChange={handleChange}
                        placeholder="Enter your feedback..."
                        rows={4}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}