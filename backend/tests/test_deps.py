from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.deps import get_current_user, get_current_user_optional


class FakeQuery:
    def __init__(self, state):
        self.state = state

    def filter(self, *_args, **_kwargs):
        return self

    def first(self):
        return self.state["users_by_id"].get(self.state["current_user_id"])


class FakeDB:
    def __init__(self, state):
        self.state = state

    def query(self, _model):
        return FakeQuery(self.state)


def _make_request(*, header_token=None, cookie_token=None, query_token=None):
    headers = {}
    if header_token:
        headers["Authorization"] = f"Bearer {header_token}"
    cookies = {}
    if cookie_token:
        cookies["access_token"] = cookie_token
    query_params = {}
    if query_token:
        query_params["access_token"] = query_token

    return SimpleNamespace(headers=headers, cookies=cookies, query_params=query_params)


def test_get_current_user_prefers_cookie_over_bearer(monkeypatch):
    state = {
        "current_user_id": None,
        "users_by_id": {
            101: SimpleNamespace(customer_id=101, email="google@example.com"),
            202: SimpleNamespace(customer_id=202, email="github@163.com"),
        },
    }
    db = FakeDB(state)

    def fake_decode(token, *_args, **_kwargs):
        mapping = {"stale-header-token": "101", "fresh-cookie-token": "202"}
        state["current_user_id"] = int(mapping[token])
        return {"sub": mapping[token]}

    monkeypatch.setattr("app.api.deps.jwt.decode", fake_decode)

    request = _make_request(
        header_token="stale-header-token",
        cookie_token="fresh-cookie-token",
    )

    user = get_current_user(request=request, db=db, token="stale-header-token")

    assert user.customer_id == 202
    assert user.email == "github@163.com"


def test_get_current_user_optional_prefers_cookie_over_bearer(monkeypatch):
    state = {
        "current_user_id": None,
        "users_by_id": {
            101: SimpleNamespace(customer_id=101, email="google@example.com"),
            202: SimpleNamespace(customer_id=202, email="github@163.com"),
        },
    }
    db = FakeDB(state)

    def fake_decode(token, *_args, **_kwargs):
        mapping = {"stale-header-token": "101", "fresh-cookie-token": "202"}
        state["current_user_id"] = int(mapping[token])
        return {"sub": mapping[token]}

    monkeypatch.setattr("app.api.deps.jwt.decode", fake_decode)

    request = _make_request(
        header_token="stale-header-token",
        cookie_token="fresh-cookie-token",
    )

    user = get_current_user_optional(request=request, db=db)

    assert user.customer_id == 202
    assert user.email == "github@163.com"


def test_get_current_user_raises_401_without_any_token():
    request = _make_request()
    db = FakeDB({"current_user_id": None, "users_by_id": {}})

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(request=request, db=db, token=None)

    assert exc_info.value.status_code == 401
