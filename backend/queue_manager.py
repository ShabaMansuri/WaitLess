from token_manager import get_tokens, get_single_token, update_token_status


service_times = []


def get_queue():
    tokens = get_tokens()

    waiting_tokens = []
    current_serving = None

    for token in tokens:
        if token["status"] == "waiting":
            waiting_tokens.append(token)

        elif token["status"] == "serving":
            current_serving = token

    waiting_tokens.sort(key=lambda x: int(x["token"]))

    return {
        "current_serving": current_serving,
        "waiting_tokens": waiting_tokens,
        "people_waiting": len(waiting_tokens)
    }


def leave_queue(token: int):
    token_data = get_single_token(token)

    if not token_data:
        return {"error": "Token not found"}

    if token_data["status"] != "waiting":
        return {
            "error": "Token cannot leave queue",
            "status": token_data["status"]
        }

    update_token_status(token, "left")

    return {
        "message": "Left the queue",
        "token": token
    }