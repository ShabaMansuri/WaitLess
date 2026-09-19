from token_manager import tokens
from queue_manager import service_times


def get_eta(token: int):
    target_token = None

    for t in tokens:
        if t["token"] == token:
            target_token = t
            break

    if target_token is None:
        return {"error": "Token not found"}

    if target_token["status"] in ["completed", "skipped", "left"]:
        return {
            "token": token,
            "people_ahead": 0,
            "average_service_time": 0,
            "eta_minutes": 0
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

    for t in tokens:
        if t["token"] == token:
            break

        if t["status"] == "waiting":
            people_ahead += 1

    if service_times:
        average_service_time = sum(service_times) / len(service_times)
    else:
        average_service_time = 5

    currently_serving = False

    for t in tokens:
        if t["status"] == "serving":
            currently_serving = True
            break

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