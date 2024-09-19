import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [reviewType, setReviewType] = useState(""); // "client" or "employee"
  const [copyStatus, setCopyStatus] = useState(""); // Added state for copy status

  const keywordsClient = [
    "Timeline",
    "Communication",
    "Infrastructure",
    "Quality",
    "Team",
    "Security",
    "Ethics",
  ];

  const keywordsEmployee = [
    "Colleagues",
    "Work Ethics",
    "Infrastructure",
    "Learning",
    "Growth",
    "Motivation",
  ];

  function handleRating(ratingValue) {
    setRating(ratingValue);
  }

  function toggleKeyword(keyword) {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  }

  async function generateAnswer() {
    setAnswer("Generating review...");

    // Construct the prompt dynamically
    const reviewTypeText =
      reviewType === "client"
        ? "client review focusing on engineering services outsourcing"
        : "employee review focusing on work environment";

    const keywordText = selectedKeywords.join(", ");
    
    // Make the API call to Gemini
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=PAST YOUR GEMINI KEY",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Generate a ${rating}-star ${reviewTypeText} for PrimaVerse. Focus on the following aspects: ${keywordText}. The review should be between 75 and 150 words, SEO-friendly, unique, and simple to read.the code should not give any formatted results, no bold, underlined, italics, etc. just give text. the review should also avoid beginning words like at, in, etc. and should be humanized. the review should also not use separators like :. .`,
                },
              ],
            },
          ],
        },
      });

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAnswer("Failed to generate review. Please try again.");
    }
  }

  function copyToClipboardAndRedirect() {
    navigator.clipboard.writeText(answer).then(() => {
      setCopyStatus("Review copied to clipboard! Redirecting...");

      setTimeout(() => {
        window.location.href = "https://g.page/r/CWw7Vn3SLbmQEBM/review";
      }, 2000); // Redirect after 2 seconds
    }).catch(() => {
      setCopyStatus("Failed to copy review. Please try again.");
    });
  }

  return (
    <div className="container">
      <h1>PrimaVerse AI Review</h1>
      <div>
        <h2>Select Review Type</h2>
        <button onClick={() => setReviewType("client")}>Client</button>
        <button onClick={() => setReviewType("employee")}>Employee</button>
      </div>

      {reviewType && (
        <>
          <div>
            <h2>Rate Us</h2>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${rating > index ? "selected" : ""}`}
                onClick={() => handleRating(index + 1)}
              >
                ★
              </span>
            ))}
          </div>

          <div>
            <h2>Select Keywords</h2>
            {reviewType === "client" &&
              keywordsClient.map((keyword) => (
                <button
                  key={keyword}
                  className={`keyword ${
                    selectedKeywords.includes(keyword) ? "selected" : ""
                  }`}
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                </button>
              ))}
            {reviewType === "employee" &&
              keywordsEmployee.map((keyword) => (
                <button
                  key={keyword}
                  className={`keyword ${
                    selectedKeywords.includes(keyword) ? "selected" : ""
                  }`}
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                </button>
              ))}
          </div>

          <button onClick={generateAnswer}>Generate Review</button>

          <p>{answer}</p>

          {answer && (
            <button onClick={copyToClipboardAndRedirect}>Submit Review</button>
          )}

          {/* Display copy status */}
          {copyStatus && <p>{copyStatus}</p>}
        </>
      )}
    </div>
  );
}

export default App;
