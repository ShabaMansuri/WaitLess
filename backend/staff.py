from datetime import datetime

from token_manager import tokens
from queue_manager import service_times


def next_token():
    for token in tokens:
        if token["status"] == "waiting":
            token["status"] = "serving"
            token["start_time"] = datetime.now().isoformat()

            return {
                "message": "Service started",
                "token": token["token"],
                "name": token["name"],
                "mobile": token["mobile"],
                "service": token["service"],
                "start_time": token["start_time"]
            }

    return {"message": "No waiting tokens"}


def complete_token(token: int):
    for t in tokens:
        if t["token"] == token:

            if t["status"] != "serving":
                return {
                    "error": "Token is not currently being served",
                    "status": t["status"]
                }

            t["end_time"] = datetime.now().isoformat()

            start = datetime.fromisoformat(t["start_time"])
            end = datetime.fromisoformat(t["end_time"])

            duration = (end - start).total_seconds() / 60

            if duration < 0.1:
                duration = 0.1

            service_times.append(duration)

            t["status"] = "completed"

            return {
                "message": "Token completed",
                "token": token,
                "service_time_minutes": round(duration, 2)
            }

    return {"error": "Token not found"}


def skip_token(token: int):
    for t in tokens:
        if t["token"] == token:

            if t["status"] not in ["waiting", "serving"]:
                return {
                    "error": "Token cannot be skipped",
                    "status": t["status"]
                }

            if t["status"] == "serving":
                t["end_time"] = datetime.now().isoformat()

            t["status"] = "skipped"

            return {
                "message": "Token skipped",
                "token": token
            }

    return {"error": "Token not found"}