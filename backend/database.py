from opensearchpy import OpenSearch


# =====================================================
# OPENSEARCH CONFIGURATION
# =====================================================

OPENSEARCH_HOST = "localhost"
OPENSEARCH_PORT = 9200
INDEX_NAME = "waitless_tokens"


# =====================================================
# OPENSEARCH CLIENT
# =====================================================

client = OpenSearch(
    hosts=[
        {
            "host": OPENSEARCH_HOST,
            "port": OPENSEARCH_PORT
        }
    ],
    use_ssl=False,
    verify_certs=False,
    ssl_show_warn=False
)


# =====================================================
# INDEX SETUP
# =====================================================

def ensure_index():
    """
    Create the WaitLess token index if it does not already exist.
    """

    if client.indices.exists(index=INDEX_NAME):
        return

    client.indices.create(
        index=INDEX_NAME,
        body={
            "mappings": {
                "properties": {
                    "token": {
                        "type": "integer"
                    },
                    "name": {
                        "type": "keyword"
                    },
                    "mobile": {
                        "type": "keyword"
                    },
                    "service": {
                        "type": "keyword"
                    },
                    "status": {
                        "type": "keyword"
                    },
                    "start_time": {
                        "type": "date"
                    },
                    "end_time": {
                        "type": "date"
                    }
                }
            }
        }
    )


# Make sure the index exists when the backend starts.
ensure_index()


# =====================================================
# GET ALL TOKENS
# =====================================================

def get_all_tokens():
    response = client.search(
        index=INDEX_NAME,
        body={
            "size": 10000,
            "query": {
                "match_all": {}
            },
            "sort": [
                {
                    "token": {
                        "order": "asc"
                    }
                }
            ]
        }
    )

    return [
        hit["_source"]
        for hit in response["hits"]["hits"]
    ]


# =====================================================
# GET SINGLE TOKEN
# =====================================================

def get_token(token_number: int):
    try:
        response = client.get(
            index=INDEX_NAME,
            id=str(token_number)
        )

        return response["_source"]

    except Exception:
        return None


# =====================================================
# SAVE TOKEN
# =====================================================

def save_token(token_data):
    token_number = int(token_data["token"])

    client.index(
        index=INDEX_NAME,
        id=str(token_number),
        body=token_data,
        refresh=True
    )


# =====================================================
# UPDATE TOKEN
# =====================================================

def update_token(token_number: int, token_data):
    client.index(
        index=INDEX_NAME,
        id=str(token_number),
        body=token_data,
        refresh=True
    )


# =====================================================
# DELETE TOKEN
# =====================================================

def delete_token(token_number: int):
    try:
        client.delete(
            index=INDEX_NAME,
            id=str(token_number),
            refresh=True
        )

    except Exception:
        pass