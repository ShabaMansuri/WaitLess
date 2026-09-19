from pydantic import BaseModel


class TokenRequest(BaseModel):
    name: str
    mobile: str
    location: str
    service: str


tokens = []
current_token = 0


def create_token(data: TokenRequest):
    global current_token

    current_token += 1

    new_token = {
        "token": current_token,
        "name": data.name,
        "mobile": data.mobile,
        "location": data.location,
        "service": data.service,
        "status": "waiting",
        "start_time": None,
        "end_time": None
    }

    tokens.append(new_token)

    return {
        "token": current_token,
        "name": data.name,
        "mobile": data.mobile,
        "location": data.location,
        "service": data.service,
        "status": "waiting",
        "message": "Token created successfully"
    }