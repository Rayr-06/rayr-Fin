from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "RAYR API running"}

@app.get("/health")
def health():
    return {"health": "ok"}