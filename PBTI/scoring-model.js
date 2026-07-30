(function () {
  const TYPE_CODES = [
    'MASTER',
    'NEED',
    'YUMMY',
    'NEW',
    'PHOTO',
    'REPORT',
    'DESSERT',
    'BREW'
  ];

  const DIMENSIONS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];

  // Each option contributes to several bear types at different strengths.
  // Vector order follows TYPE_CODES. The three rows are options A, B and C.
  const OPTION_WEIGHTS = {
    q1: [
      [0, 1, 3, 0, 0, 0, 0, 0],
      [1, 1, 2, 0, 0, 0, 0, 0],
      [4, 0, 0, 0, 0, 0, 0, 0]
    ],
    q2: [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0],
      [4, 0, 0, 2, 0, 1, 0, 1]
    ],
    q3: [
      [0, 0, 2, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 0, 0, 0, 0]
    ],
    q4: [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 2, 0, 1, 0, 0, 0, 0],
      [0, 4, 0, 2, 0, 0, 0, 0]
    ],
    q5: [
      [2, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 4, 1, 0, 0, 2, 0]
    ],
    q6: [
      [2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 1, 0],
      [0, 0, 4, 0, 0, 0, 2, 0]
    ],
    q7: [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 0, 1, 0, 0],
      [1, 0, 0, 4, 1, 2, 0, 0]
    ],
    q8: [
      [1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 2, 0, 0, 0, 0],
      [0, 1, 0, 4, 1, 1, 0, 0]
    ],
    q9: [
      [2, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 4, 1, 0, 0]
    ],
    q10: [
      [1, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0]
    ],
    q11: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 2, 0, 0],
      [1, 0, 0, 2, 1, 4, 0, 0]
    ],
    q12: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 2, 0, 0],
      [1, 0, 0, 1, 0, 4, 0, 0]
    ],
    q13: [
      [1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 1, 0, 6, 0]
    ],
    q14: [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 2],
      [2, 0, 0, 1, 0, 0, 0, 6]
    ],
    q15: [
      [0, 1, 1, 0, 0, 0, 0, 0],
      [0, 2, 1, 0, 0, 0, 0, 2],
      [1, 1, 0, 0, 0, 0, 0, 6]
    ]
  };

  function buildPercentileScale(typeIndex) {
    let distribution = new Map([[0, 1]]);

    Object.values(OPTION_WEIGHTS).forEach((options) => {
      const next = new Map();
      distribution.forEach((count, total) => {
        options.forEach((option) => {
          const score = total + option[typeIndex];
          next.set(score, (next.get(score) || 0) + count);
        });
      });
      distribution = next;
    });

    const totals = [...distribution.keys()].sort((a, b) => a - b);
    const responseCount = [...distribution.values()].reduce((sum, count) => sum + count, 0);
    const midpoints = new Map();
    let below = 0;

    totals.forEach((total) => {
      const count = distribution.get(total);
      midpoints.set(total, ((below + count / 2) / responseCount) * 100);
      below += count;
    });

    const low = midpoints.get(totals[0]);
    const high = midpoints.get(totals[totals.length - 1]);
    const span = high - low || 1;

    return new Map(totals.map((total) => [
      total,
      ((midpoints.get(total) - low) / span) * 100
    ]));
  }

  const percentileScales = TYPE_CODES.map((_, index) => buildPercentileScale(index));

  function calculate(answers) {
    const raw = new Array(TYPE_CODES.length).fill(0);

    Object.entries(OPTION_WEIGHTS).forEach(([questionId, options]) => {
      const optionIndex = Number(answers[questionId]) - 1;
      if (!Number.isInteger(optionIndex) || !options[optionIndex]) return;

      options[optionIndex].forEach((weight, typeIndex) => {
        raw[typeIndex] += weight;
      });
    });

    const typeScores = {};
    const evidence = {};
    const dimensionScores = {};
    const levels = {};

    TYPE_CODES.forEach((code, index) => {
      const score = percentileScales[index].get(raw[index]) || 0;
      const dimension = DIMENSIONS[index];
      typeScores[code] = score;
      evidence[code] = raw[index];
      dimensionScores[dimension] = score;
      levels[dimension] = score < 40 ? 'L' : score > 60 ? 'H' : 'M';
    });

    return { rawScores: evidence, typeScores, evidence, dimensionScores, levels };
  }

  window.PBTI_SCORING_MODEL = Object.freeze({
    TYPE_CODES,
    DIMENSIONS,
    OPTION_WEIGHTS,
    calculate
  });
})();
