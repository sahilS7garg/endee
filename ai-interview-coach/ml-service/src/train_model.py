import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_difficulty_model():
    # Sample data for training (in production, this would come from the database)
    data = {
        'description': [
            'Find the maximum element in an array.',
            'Implement a function to reverse a linked list.',
            'Solve the traveling salesman problem using dynamic programming.',
            'Find the shortest path in a weighted graph with negative cycles.',
            'Check if a string is a palindrome.',
            'Implement a balanced binary search tree.',
            'Find the longest common subsequence of two strings.',
            'Implement a thread-safe singleton pattern.',
            'Sort an array using quicksort.',
            'Implement a neural network from scratch.'
        ],
        'constraints_count': [1, 2, 5, 8, 1, 4, 6, 7, 2, 10],
        'example_count': [1, 2, 3, 4, 1, 2, 3, 2, 2, 5],
        'difficulty': ['Easy', 'Easy', 'Hard', 'Hard', 'Easy', 'Medium', 'Medium', 'Medium', 'Easy', 'Hard']
    }
    
    df = pd.DataFrame(data)
    
    # Preprocessing
    tfidf = TfidfVectorizer(stop_words='english')
    X_text = tfidf.fit_transform(df['description'])
    X_features = df[['constraints_count', 'example_count']].values
    
    # Combine features (simplified for this task)
    import numpy as np
    from scipy.sparse import hstack
    X = hstack([X_text, X_features])
    
    le = LabelEncoder()
    y = le.fit_transform(df['difficulty'])
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    
    # Save model and transformers
    if not os.path.exists('models'):
        os.makedirs('models')
    joblib.dump(model, 'models/difficulty_model.pkl')
    joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')
    joblib.dump(le, 'models/label_encoder.pkl')
    print("Model trained and saved successfully.")

if __name__ == "__main__":
    train_difficulty_model()
