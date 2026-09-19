from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from token_manager import TokenRequest, create_token
from queue_manager import get_queue, leave_queue
from eta import get_eta
from staff import next_token, complete_token, skip_token


app = FastAPI(title="WaitLess Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "WaitLess Backend is running"}


@app.post("/token")
def token_endpoint(data: TokenRequest):
    return create_token(data)


@app.get("/queue")
def queue_endpoint():
    return get_queue()


@app.get("/eta/{token}")
def eta_endpoint(token: int):
    return get_eta(token)


@app.post("/queue/next")
def next_endpoint():
    return next_token()


@app.post("/queue/complete")
def complete_endpoint(token: int):
    return complete_token(token)


@app.post("/queue/skip")
def skip_endpoint(token: int):
    return skip_token(token)


@app.post("/queue/leave")
def leave_endpoint(token: int):
    return leave_queue(token)