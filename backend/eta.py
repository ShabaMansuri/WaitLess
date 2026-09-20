from token_manager import get_tokens, get_single_token
from queue_manager import service_times


def get_eta(token: int):
    tokens = get_tokens()

    target_token = get_single_token(token)

    if target_token is None:
        return {"error": "Token not found"}

    if target_token["status"] in ["completed", "skipped", "left"]:
        return {
            "token": token,
            "people_ahead": 0,
            "average_service_time": 0,
            "eta_minutes": 0,
            "status": target_token["status"]
        }

    if target_token["status"] == "serving":
        if service_times:
            average_service_time = sum(service_times) / len(service_times)
        else:
            average_service_time = 5

        return {
            "token": token,
            "people_ahead": 0,
            "average_service_time": round(average_service_time, 2),
            "eta_minutes": 0,
            "status": "serving"
        }

    people_ahead = 0

    for current_token in tokens:
        if int(current_token["token"]) == token:
            break

        if current_token["status"] == "waiting":
            people_ahead += 1

    if service_times:
        average_service_time = sum(service_times) / len(service_times)
    else:
        average_service_time = 5

    currently_serving = any(
        current_token["status"] == "serving"
        for current_token in tokens
    )

    if currently_serving:
        estimated_services = people_ahead + 1
    else:
        estimated_services = people_ahead

    eta = round(estimated_services * average_service_time)

    return {
        "token": token,
        "people_ahead": people_ahead,
        "average_service_time": round(average_service_time, 2),
        "eta_minutes": eta,
        "status": "waiting"
    }