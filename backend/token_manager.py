from pydantic import BaseModel

from database import (
    get_all_tokens,
    get_token,
    save_token,
    update_token,
    delete_token,
)


class TokenRequest(BaseModel):
    name: str
    mobile: str
    service: str


def get_next_token_number():
    tokens = get_all_tokens()

    if not tokens:
        return 1

    return max(int(token["token"]) for token in tokens) + 1


def create_token(data: TokenRequest):
    token_number = get_next_token_number()

    token_data = {
        "token": token_number,
        "name": data.name,
        "mobile": data.mobile,
        "service": data.service,
        "status": "waiting",
    }

    save_token(token_data)

    return token_data


def get_tokens():
    return get_all_tokens()


def get_single_token(token_number: int):
    return get_token(token_number)


def update_token_status(token_number: int, status: str):
    token = get_token(token_number)

    if not token:
        return None

    token["status"] = status
    update_token(token_number, token)

    return token


def remove_token(token_number: int):
    token = get_token(token_number)

    if not token:
        return None

    delete_token(token_number)

    return token