from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from scipy.sparse import hstack
import os

app = FastAPI(title="AI Interview Coach ML Service")

# Load models
MODEL_PATH = 'models/difficulty_model.pkl'
TFIDF_PATH = 'models/tfidf_vectorizer.pkl'
LE_PATH = 'models/label_encoder.pkl'

model = None
tfidf = None
le = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    tfidf = joblib.load(TFIDF_PATH)
    le = joblib.load(LE_PATH)

class ProblemInput(BaseModel):
    description: str
    constraints_count: int
    example_count: int

@app.get("/")
def read_root():
    return {"message": "ML Service is running"}

@app.post("/predict_difficulty")
def predict_difficulty(problem: ProblemInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    X_text = tfidf.transform([problem.description])
    X_features = np.array([[problem.constraints_count, problem.example_count]])
    X = hstack([X_text, X_features])
    
    prediction = model.predict(X)
    difficulty = le.inverse_transform(prediction)[0]
    
    return {"difficulty": difficulty}

# Recommendation Engine Logic
@app.post("/recommend_problems")
def recommend_problems(user_data: dict):
    # user_data: { "solved_ids": [...], "topics": { "arrays": 5, "graphs": 2, ... } }
    # Simplified Cosine Similarity implementation
    topics = ['arrays', 'graphs', 'dynamic programming', 'strings', 'trees', 'greedy']
    user_vector = np.array([user_data.get('topics', {}).get(t, 0) for t in topics]).reshape(1, -1)
    
    # Dummy problem corpus for demonstration
    problem_corpus = [
        {"id": "p1", "vector": [1, 0, 0, 0, 0, 0], "topic": "arrays"},
        {"id": "p2", "vector": [0, 1, 0, 0, 0, 0], "topic": "graphs"},
        {"id": "p3", "vector": [0, 0, 1, 0, 0, 0], "topic": "dynamic programming"},
        {"id": "p4", "vector": [1, 1, 0, 0, 0, 0], "topic": "arrays/graphs"},
    ]
    
    similarities = []
    for p in problem_corpus:
        if p['id'] in user_data.get('solved_ids', []): continue
        p_vector = np.array(p['vector']).reshape(1, -1)
        # Cosine similarity simplified: dot product of normalized vectors
        norm_u = np.linalg.norm(user_vector)
        norm_p = np.linalg.norm(p_vector)
        if norm_u == 0 or norm_p == 0:
            sim = 0
        else:
            sim = np.dot(user_vector, p_vector.T)[0][0] / (norm_u * norm_p)
        similarities.append({"id": p['id'], "score": sim})
    
    # Sort by similarity score
    recommendations = sorted(similarities, key=lambda x: x['score'], reverse=True)
    return {"recommendations": recommendations[:10]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
