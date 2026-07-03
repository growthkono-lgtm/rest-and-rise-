// 기백씨(Give Back Seed) 성장 단계
// 승인된 봉사활동 수가 쌓일수록 씨앗이 자라납니다.

export type Stage = {
  key: string;
  name: string; // 한글 단계명
  emoji: string;
  min: number; // 이 단계에 도달하는 최소 활동 수
  blurb: string; // 단계 설명
};

export const STAGES: Stage[] = [
  {
    key: "seed",
    name: "씨앗",
    emoji: "🌰",
    min: 0,
    blurb: "기백씨가 곤히 잠들어 있어요. 첫 활동으로 깨워주세요.",
  },
  {
    key: "sprout",
    name: "새싹",
    emoji: "🌱",
    min: 1,
    blurb: "기백씨가 눈을 떴어요! 여린 새싹이 돋았습니다.",
  },
  {
    key: "sapling",
    name: "어린나무",
    emoji: "🌿",
    min: 3,
    blurb: "줄기가 단단해지고 잎이 무성해졌어요.",
  },
  {
    key: "tree",
    name: "나무",
    emoji: "🌳",
    min: 6,
    blurb: "든든한 나무로 자랐어요. 그늘을 나눌 수 있게 됐죠.",
  },
  {
    key: "forest",
    name: "숲",
    emoji: "🌲",
    min: 10,
    blurb: "기백씨가 하나의 숲이 되었어요. 회복이 널리 퍼집니다.",
  },
];

export type Growth = {
  count: number;
  stage: Stage;
  stageIndex: number;
  next: Stage | null;
  toNext: number; // 다음 단계까지 남은 활동 수
  progress: number; // 현재 단계 구간 진행률 0~1
};

export function computeGrowth(count: number): Growth {
  let stageIndex = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (count >= STAGES[i].min) stageIndex = i;
  }
  const stage = STAGES[stageIndex];
  const next = STAGES[stageIndex + 1] ?? null;
  const toNext = next ? Math.max(0, next.min - count) : 0;

  let progress = 1;
  if (next) {
    const span = next.min - stage.min;
    progress = span > 0 ? (count - stage.min) / span : 1;
  }

  return { count, stage, stageIndex, next, toNext, progress };
}
