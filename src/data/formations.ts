import type { Formation } from "@/types";

// y: 0 = own goal line, 100 = opponent goal line. x: 0 = left touchline, 100 = right touchline.
export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    description: "균형 잡힌 공격 포메이션. 측면 윙어를 활용한 폭넓은 공격에 강함.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "LB", label: "LB", x: 15, y: 22 },
      { role: "CB", label: "CB", x: 37, y: 16 },
      { role: "CB", label: "CB", x: 63, y: 16 },
      { role: "RB", label: "RB", x: 85, y: 22 },
      { role: "CM", label: "CM", x: 30, y: 46 },
      { role: "CDM", label: "CDM", x: 50, y: 38 },
      { role: "CM", label: "CM", x: 70, y: 46 },
      { role: "LW", label: "LW", x: 18, y: 76 },
      { role: "ST", label: "ST", x: 50, y: 84 },
      { role: "RW", label: "RW", x: 82, y: 76 },
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    description: "안정적인 라인 간격의 전통적 포메이션. 중원 장악과 크로스 공격에 유리.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "LB", label: "LB", x: 15, y: 22 },
      { role: "CB", label: "CB", x: 37, y: 16 },
      { role: "CB", label: "CB", x: 63, y: 16 },
      { role: "RB", label: "RB", x: 85, y: 22 },
      { role: "LM", label: "LM", x: 14, y: 50 },
      { role: "CM", label: "CM", x: 38, y: 46 },
      { role: "CM", label: "CM", x: 62, y: 46 },
      { role: "RM", label: "RM", x: 86, y: 50 },
      { role: "ST", label: "ST", x: 38, y: 82 },
      { role: "ST", label: "ST", x: 62, y: 82 },
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    description: "이중 수비형 미드필더로 수비 밸런스를 확보하고 공격형 미드필더로 창의성을 더함.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "LB", label: "LB", x: 15, y: 22 },
      { role: "CB", label: "CB", x: 37, y: 16 },
      { role: "CB", label: "CB", x: 63, y: 16 },
      { role: "RB", label: "RB", x: 85, y: 22 },
      { role: "CDM", label: "CDM", x: 38, y: 36 },
      { role: "CDM", label: "CDM", x: 62, y: 36 },
      { role: "LM", label: "LAM", x: 18, y: 62 },
      { role: "CAM", label: "CAM", x: 50, y: 60 },
      { role: "RM", label: "RAM", x: 82, y: 62 },
      { role: "ST", label: "ST", x: 50, y: 84 },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    description: "윙백을 활용한 측면 장악형 포메이션. 중원 숫자 우위로 볼 점유에 강함.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "CB", label: "CB", x: 26, y: 18 },
      { role: "CB", label: "CB", x: 50, y: 14 },
      { role: "CB", label: "CB", x: 74, y: 18 },
      { role: "LB", label: "LWB", x: 9, y: 46 },
      { role: "CM", label: "CM", x: 34, y: 42 },
      { role: "CDM", label: "CDM", x: 50, y: 38 },
      { role: "CM", label: "CM", x: 66, y: 42 },
      { role: "RB", label: "RWB", x: 91, y: 46 },
      { role: "ST", label: "ST", x: 38, y: 80 },
      { role: "ST", label: "ST", x: 62, y: 80 },
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    description: "스리백과 두 명의 섀도우 스트라이커로 중원 숫자 우위와 압박 회피를 동시에 노림.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "CB", label: "CB", x: 30, y: 16 },
      { role: "CB", label: "CB", x: 50, y: 13 },
      { role: "CB", label: "CB", x: 70, y: 16 },
      { role: "LM", label: "LM", x: 12, y: 42 },
      { role: "CM", label: "CM", x: 38, y: 40 },
      { role: "CM", label: "CM", x: 62, y: 40 },
      { role: "RM", label: "RM", x: 88, y: 42 },
      { role: "CAM", label: "AML", x: 35, y: 64 },
      { role: "CAM", label: "AMR", x: 65, y: 64 },
      { role: "ST", label: "ST", x: 50, y: 84 },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    description: "다섯 명의 수비 라인으로 실점을 최소화하는 견고한 수비형 포메이션.",
    slots: [
      { role: "GK", label: "GK", x: 50, y: 6 },
      { role: "LB", label: "LWB", x: 12, y: 24 },
      { role: "CB", label: "CB", x: 30, y: 15 },
      { role: "CB", label: "CB", x: 50, y: 12 },
      { role: "CB", label: "CB", x: 70, y: 15 },
      { role: "RB", label: "RWB", x: 88, y: 24 },
      { role: "CM", label: "CM", x: 30, y: 46 },
      { role: "CDM", label: "CDM", x: 50, y: 40 },
      { role: "CM", label: "CM", x: 70, y: 46 },
      { role: "ST", label: "ST", x: 38, y: 78 },
      { role: "ST", label: "ST", x: 62, y: 78 },
    ],
  },
];

export function getFormation(id: string): Formation {
  const f = formations.find((f) => f.id === id);
  if (!f) throw new Error(`Unknown formation: ${id}`);
  return f;
}
