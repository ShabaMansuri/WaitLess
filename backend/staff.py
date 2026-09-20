from datetime import datetime

from token_manager import (
    get_tokens,
    get_single_token,
    update_token_status,
)
from queue_manager import service_times


def next_token():
    tokens = get_tokens()

    waiting_tokens = [
        token for token in tokens
        if token["status"] == "waiting"
    ]

    waiting_tokens.sort(key=lambda x: int(x["token"]))

    if not waiting_tokens:
        return {"message": "No waiting tokens"}

    token = waiting_tokens[0]

    start_time = datetime.now().isoformat()

    token["status"] = "serving"
    token["start_time"] = start_time

    from database import update_token

    update_token(int(token["token"]), token)

    return {
        "message": "Service started",
        "token": token["token"],
        "name": token["name"],
        "mobile": token["mobile"],
        "service": token["service"],
        "start_time": start_time
    }


def complete_token(token: int):
    token_data = get_single_token(token)

    if not token_data:
        return {"error": "Token not found"}

    if token_data["status"] != "serving":
        return {
            "error": "Token is not currently being served",
            "status": token_data["status"]
        }

    end_time = datetime.now().isoformat()
    token_data["end_time"] = end_time

    start_time = datetime.fromisoformat(token_data["start_time"])
    end = datetime.fromisoformat(end_time)

    duration = (end - start_time).total_seconds() / 60

    if duration < 0.1:
        duration = 0.1

    service_times.append(duration)

    token_data["status"] = "completed"

    from database import update_token

    update_token(token, token_data)

    return {
        "message": "Token completed",
        "token": token,
        "service_time_minutes": round(duration, 2)
    }


def skip_token(token: int):
    token_data = get_single_token(token)

    if not token_data:
        return {"error": "Token not found"}

    if token_data["status"] not in ["waiting", "serving"]:
        return {
            "error": "Token cannot be skipped",
            "status": token_data["status"]
        }

    if token_data["status"] == "serving":
        token_data["end_time"] = datetime.now().isoformat()

    token_data["status"] = "skipped"

    from database import update_token

    update_token(token, token_data)

    return {
        "message": "Token skipped",
        "token": token
    }