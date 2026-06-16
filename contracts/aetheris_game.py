# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


def _addr(a) -> str:
    return str(a).lower()


class AetherisGame(gl.Contract):
    registered: TreeMap[str, bool]
    player_names: TreeMap[str, str]
    gen_balance: TreeMap[str, u256]
    reputation: TreeMap[str, u256]
    total_score: TreeMap[str, u256]
    games_played: TreeMap[str, u256]
    wins: TreeMap[str, u256]
    losses: TreeMap[str, u256]
    current_streak: TreeMap[str, u256]
    best_streak: TreeMap[str, u256]
    has_active: TreeMap[str, bool]
    round_results: TreeMap[str, str]
    session_correct: TreeMap[str, u256]
    session_total: TreeMap[str, u256]
    session_score: TreeMap[str, u256]
    session_gen: TreeMap[str, u256]
    session_votes: TreeMap[str, u256]
    leaderboard: TreeMap[str, str]
    leaderboard_by_player: TreeMap[str, str]
    leaderboard_count: u256
    total_players: u256
    total_games: u256
    total_votes: u256
    base_reward: u256
    streak_bonus: u256
    penalty: u256

    def __init__(self):
        self.total_players = u256(0)
        self.total_games = u256(0)
        self.total_votes = u256(0)
        self.leaderboard_count = u256(0)
        self.base_reward = u256(50)
        self.streak_bonus = u256(10)
        self.penalty = u256(30)

    @gl.public.write
    def register(self, alias: str) -> str:
        s = _addr(gl.message.sender_address)
        if s in self.registered:
            return "already registered"
        self.registered[s] = True
        self.player_names[s] = alias
        self.gen_balance[s] = u256(1)
        self.reputation[s] = u256(50)
        self.total_score[s] = u256(0)
        self.games_played[s] = u256(0)
        self.wins[s] = u256(0)
        self.losses[s] = u256(0)
        self.current_streak[s] = u256(0)
        self.best_streak[s] = u256(0)
        self.has_active[s] = False
        self.total_players += u256(1)
        return "registered:" + alias

    @gl.public.write
    def start_session(self) -> str:
        s = _addr(gl.message.sender_address)
        if not self.registered.get(s, False):
            return "not registered"
        if self.has_active.get(s, False):
            return "session active"
        self.has_active[s] = True
        self.session_correct[s] = u256(0)
        self.session_total[s] = u256(0)
        self.session_score[s] = u256(0)
        self.session_gen[s] = u256(0)
        self.session_votes[s] = u256(0)
        self.total_games += u256(1)
        return "session started"

    @gl.public.write
    def evaluate_vote(self, proposal: str, player_vote: str, context: str, difficulty: u256) -> str:
        s = _addr(gl.message.sender_address)
        if not self.has_active.get(s, False):
            return "no session"

        def judge():
            prompt = (
                "GENLAYER CONSENSUS JUDGE\n"
                "Proposal: " + proposal + "\n"
                "Context: " + context + "\n"
                "Difficulty: " + str(difficulty) + "/3\n"
                "Player voted: " + player_vote + "\n"
                "Determine if the vote is correct. Reply ONLY: correct or wrong"
            )
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_comparative(
            judge,
            "Both validators must agree whether the vote is correct or wrong. Reply ONLY: correct or wrong",
        )

        is_correct = "correct" in result.lower()
        self.total_votes += u256(1)

        streak = self.current_streak.get(s, u256(0))
        total_correct = int(self.session_correct.get(s, u256(0)))
        total_score = int(self.session_score.get(s, u256(0)))
        total_gen = int(self.session_gen.get(s, u256(0)))

        if is_correct:
            total_correct += 1
            streak += 1
            reward = self.base_reward + (difficulty * u256(25)) + (streak * self.streak_bonus)
            total_score += int(reward)
            total_gen += int(reward)
        else:
            streak = 0
            pen = min(int(self.penalty), total_gen)
            total_gen -= pen

        self.current_streak[s] = u256(streak)
        if streak > int(self.best_streak.get(s, u256(0))):
            self.best_streak[s] = u256(streak)

        self.session_correct[s] = u256(total_correct)
        self.session_total[s] = self.session_total.get(s, u256(0)) + u256(1)
        self.session_score[s] = u256(total_score)
        self.session_gen[s] = u256(total_gen)
        self.session_votes[s] = self.session_votes.get(s, u256(0)) + u256(1)

        return json.dumps({
            "correct": is_correct,
            "streak": streak,
        })

    @gl.public.write
    def end_session(self) -> str:
        s = _addr(gl.message.sender_address)
        if not self.has_active.get(s, False):
            return "no session"

        total_correct = int(self.session_correct.get(s, u256(0)))
        total_score = int(self.session_score.get(s, u256(0)))
        total_gen = int(self.session_gen.get(s, u256(0)))
        total_votes = int(self.session_votes.get(s, u256(0)))

        self.total_score[s] = self.total_score.get(s, u256(0)) + u256(total_score)
        self.gen_balance[s] = self.gen_balance.get(s, u256(0)) + u256(total_gen)
        self.games_played[s] = self.games_played.get(s, u256(0)) + u256(1)

        if total_correct > 0:
            self.wins[s] = self.wins.get(s, u256(0)) + u256(1)
            self.reputation[s] = min(u256(100), self.reputation.get(s, u256(0)) + u256(total_correct * 4))
        else:
            self.losses[s] = self.losses.get(s, u256(0)) + u256(1)
            self.reputation[s] = max(u256(0), self.reputation.get(s, u256(0)) - u256(7))

        accuracy = round((total_correct / total_votes) * 100) if total_votes > 0 else 0
        name = self.player_names.get(s, "unknown")

        existing_idx = self.leaderboard_by_player.get(s, "")
        if existing_idx:
            existing_entry = json.loads(self.leaderboard.get(existing_idx, "{}"))
            if total_score > existing_entry.get("score", 0):
                self.leaderboard[existing_idx] = json.dumps({
                    "name": name,
                    "score": total_score,
                    "accuracy": accuracy,
                    "address": s[:10] + "...",
                })
        else:
            count = int(self.leaderboard_count)
            self.leaderboard[str(count)] = json.dumps({
                "name": name,
                "score": total_score,
                "accuracy": accuracy,
                "address": s[:10] + "...",
            })
            self.leaderboard_by_player[s] = str(count)
            self.leaderboard_count = u256(count + 1)

        self.has_active[s] = False

        result_str = json.dumps({
            "correct": total_correct,
            "total": total_votes,
            "score": total_score,
            "gen": total_gen,
        })
        return result_str

    @gl.public.write
    def update_config(self, base: u256, streak: u256, pen: u256) -> str:
        self.base_reward = base
        self.streak_bonus = streak
        self.penalty = pen
        return "config updated"

    @gl.public.view
    def is_registered(self, addr: str) -> bool:
        return self.registered.get(addr.lower(), False)

    @gl.public.view
    def get_gen(self, addr: str) -> u256:
        return self.gen_balance.get(addr.lower(), u256(0))

    @gl.public.view
    def get_rep(self, addr: str) -> u256:
        return self.reputation.get(addr.lower(), u256(0))

    @gl.public.view
    def get_score(self, addr: str) -> u256:
        return self.total_score.get(addr.lower(), u256(0))

    @gl.public.view
    def get_stats(self, addr: str) -> str:
        a = addr.lower()
        if not self.registered.get(a, False):
            return "not found"
        return "score:" + str(self.total_score.get(a, u256(0))) + " gen:" + str(self.gen_balance.get(a, u256(0))) + " rep:" + str(self.reputation.get(a, u256(0)))

    @gl.public.view
    def has_active_session(self, addr: str) -> bool:
        return self.has_active.get(addr.lower(), False)

    @gl.public.view
    def get_total_players(self) -> u256:
        return self.total_players

    @gl.public.view
    def get_total_games(self) -> u256:
        return self.total_games

    @gl.public.view
    def get_total_votes(self) -> u256:
        return self.total_votes

    @gl.public.view
    def get_session_stats(self, addr: str) -> str:
        a = addr.lower()
        return json.dumps({
            "correct": int(self.session_correct.get(a, u256(0))),
            "total": int(self.session_total.get(a, u256(0))),
            "score": int(self.session_score.get(a, u256(0))),
            "gen": int(self.session_gen.get(a, u256(0))),
        })

    @gl.public.view
    def get_player_name(self, addr: str) -> str:
        return self.player_names.get(addr.lower(), "")

    @gl.public.view
    def get_leaderboard(self) -> str:
        count = int(self.leaderboard_count)
        entries = []
        for i in range(count):
            entry_json = self.leaderboard.get(str(i), "")
            if entry_json:
                entries.append(json.loads(entry_json))
        entries.sort(key=lambda x: x.get("score", 0), reverse=True)
        return json.dumps(entries[:20])

    @gl.public.view
    def get_leaderboard_count(self) -> u256:
        return self.leaderboard_count
