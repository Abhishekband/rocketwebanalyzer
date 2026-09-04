from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text_from_pdf
from scorer import calculate_score

app = Flask(__name__)
CORS(app)

# ================= UPLOAD RESUME =================
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"message": "No resume uploaded"}), 400

    file = request.files["resume"]

    resume_text = extract_text_from_pdf(file)

    return jsonify({
        "message": "Resume uploaded successfully",
        "resume_text": resume_text
    })


# ================= MATCH SCORE =================
@app.route("/match", methods=["POST"])
def match_resume():
    data = request.get_json()

    resume_text = data.get("resume_text")
    job_description = data.get("job_description")

    if not resume_text or not job_description:
        return jsonify({"message": "Missing data"}), 400

    score = calculate_score(resume_text, job_description)

    return jsonify({
        "match_score": score
    })


if __name__ == "__main__":
    app.run(debug=True)
