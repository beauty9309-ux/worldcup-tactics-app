import type { Team } from "@/types";

// Estimated squad-strength ratings (gameplay figures, not an official rating).
export const koreaTeam: Team = {
  id: "kor",
  name: "대한민국",
  flag: "🇰🇷",
  style: "counter",
  attackRating: 80,
  midfieldRating: 82,
  defenseRating: 78,
  overallRating: 80,
};

export const mexicoTeam: Team = {
  id: "mex",
  name: "멕시코",
  flag: "🇲🇽",
  style: "possession",
  attackRating: 79,
  midfieldRating: 80,
  defenseRating: 76,
  overallRating: 79,
};

export const southAfricaTeam: Team = {
  id: "rsa",
  name: "남아프리카 공화국",
  flag: "🇿🇦",
  style: "counter",
  attackRating: 74,
  midfieldRating: 76,
  defenseRating: 75,
  overallRating: 75,
};
