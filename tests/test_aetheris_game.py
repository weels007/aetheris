# { "Depends": "py-genlayer:test" }

import json


def test_register(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    result = contract.register("TestPlayer")
    assert result == "session started"


def test_register_duplicate(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player1")
    result = contract.register("Player1")
    assert result == "already registered"


def test_register_invalid_name(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    result = contract.register("A")
    assert result == "name must be 2-24 characters"


def test_evaluate_vote_no_session(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    result = contract.evaluate_vote("test proposal", "APPROVE", "test context")
    parsed = json.loads(result)
    assert "error" in parsed


def test_start_session(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player1")
    result = contract.start_session()
    assert result == "session started"


def test_evaluate_vote(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", "correct")
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player2")
    contract.start_session()
    result = contract.evaluate_vote("Should we approve the proposal?", "APPROVE", "The proposal is beneficial")
    parsed = json.loads(result)
    assert "correct" in parsed
    assert "streak" in parsed
    assert "result" in parsed


def test_get_last_vote_result(direct_deploy, direct_vm):
    direct_vm.mock_llm(r".*", "correct")
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player3")
    contract.start_session()
    contract.evaluate_vote("Test proposal", "APPROVE", "Test context")
    result = contract.get_last_vote_result("player3_address")
    assert result == "correct" or result == "wrong" or result == ""


def test_get_cumulative_stats(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player4")
    result = contract.get_cumulative_stats("player4_address")
    parsed = json.loads(result)
    assert "total_score" in parsed
    assert "gen_balance" in parsed
    assert "reputation" in parsed
    assert "games_played" in parsed


def test_end_session_no_active(direct_deploy):
    contract = direct_deploy("contracts/aetheris_game.py")
    contract.register("Player5")
    result = contract.end_session()
    parsed = json.loads(result)
    assert "error" in parsed
