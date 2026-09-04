from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_score(resume_text, job_description):
    """
    Calculate similarity score between resume and job description
    using TF-IDF + Cosine Similarity
    """

    if not resume_text or not job_description:
        return 0

    # Convert texts into a list
    documents = [resume_text, job_description]

    # Create TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=500
    )

    # Fit and transform texts
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    # Convert to percentage
    score = round(similarity * 100, 2)

    return score
