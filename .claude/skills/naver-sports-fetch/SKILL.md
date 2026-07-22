---
name: naver-sports-fetch
description: Fetch real match facts (score, scorer, minute, starting lineup, formation, substitutions) for a specific Naver Sports (m.sports.naver.com) football game, for building new crisis scenarios in this project. Use when the user gives a m.sports.naver.com/game/{gameId}/relay link and wants real match data extracted.
---

# Naver Sports match data fetch

WebFetch cannot reach `m.sports.naver.com` (blocked domain) and the page itself is a
client-rendered SPA shell anyway. Use `curl` against the underlying API instead.

## Steps

1. Get the `gameId` from the relay URL: `https://m.sports.naver.com/game/{gameId}/relay`.
2. Fetch match metadata — teams, final score, scorers, minute, competition/round/date/stadium:

```bash
curl -s --compressed "https://api-gw.sports.naver.com/schedule/games/{gameId}" \
  | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin), ensure_ascii=False, indent=2))"
```

Look at `result.game`: `homeTeamName`/`awayTeamName`, `homeTeamScore`/`awayTeamScore`,
`gameDate`, `stadium`, `groupName`/`matchRound`, and `scorers.home`/`scorers.away`
(each entry has `time` in match minutes and `playerName`).

3. Fetch the starting lineup + formation for both sides:

```bash
curl -s --compressed "https://api-gw.sports.naver.com/schedule/games/{gameId}/lineup" \
  | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin), ensure_ascii=False, indent=2))"
```

`result.lineUpData.lineup.{home,away}.formation` is the formation code (e.g. `"3421"`
= 3-4-2-1). `.players.lineup` is an array of rows (attackers first, GK last); each
player has `positionOrder` (1 = GK, ascending toward attack) and `name`.

## What this API does NOT have

- `schedule/games/{gameId}/record` and `.../relay` return `null` for most games
  (no tracked play-by-play text or detailed stats) — don't rely on them.
- The lineup endpoint only has the starting XI, not the bench or substitution events.
- `shirtNumber` is always `null` — never invent/display a jersey number as if real.

## Substitutions and other in-match events

These are NOT reliably available via the API. If the user needs substitution
timing/details (who came on for whom, at what minute) or the buildup play
description for a goal, ask the user to paste a screenshot of the relay page —
they can see the events list rendered in-browser even though the API/WebFetch
route can't reach it. Do not guess or fabricate this information.

## Real shirt numbers and squad cross-verification

Naver's `lineup` endpoint always returns `shirtNumber: null` — it has no jersey
numbers. For real numbers (and an independent cross-check of names/positions),
use `openfootball/worldcup.json` on GitHub (actively maintained, includes the
current World Cup):

```bash
curl -sL --compressed "https://raw.githubusercontent.com/openfootball/worldcup.json/master/{year}/worldcup.squads.json"
curl -sL --compressed "https://raw.githubusercontent.com/openfootball/worldcup.json/master/{year}/worldcup.json"
```

`worldcup.squads.json` is a list of 48 teams, each with a `players` array of
`{number, pos, name, club, date_of_birth}` — real shirt numbers. `worldcup.json`
has `matches: [{team1, team2, score: {ft, ht}, goals1: [{name, minute}], goals2,
group, ground, date}]` — useful to cross-check a scorer/minute/score found via
Naver against a second independent source before trusting it.

## Critical gotcha

**Always use `curl -s --compressed`.** Without `--compressed`, curl doesn't
decompress the gzip response and every Korean string comes out as mangled
JSON unicode escapes (including invalid lone surrogates). This looks like a
real encoding bug but it's just a missing flag — don't conclude the data is
corrupted before checking this.
