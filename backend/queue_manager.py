from token_manager import tokens


service_times = []


def get_queue():
    waiting_tokens = []
    current_serving = None

    for token in tokens:
        if token["status"] == "waiting":
            waiting_tokens.append(token)

        elif token["status"] == "serving":
            current_serving = token

    return {
        "current_serving": current_serving,
        "waiting_tokens": waiting_tokens,
        "people_waiting": len(waiting_tokens)
    }


def leave_queue(token: int):
    for t in tokens:
        if t["token"] == token:

            if t["status"] != "waiting":
                return {
                    "error": "Token cannot leave queue",
                    "status": t["status"]
                }

            t["status"] = "left"

            return {
                "message": "Left the queue",
                "token": token
            }

    return {"error": "Token not found"}