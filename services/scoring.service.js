
function calculateScore(questions, userAnswers) {
  let score = 0;
  for (const q of questions) {
    const qid = q.question_id;
    const correct = q.correct_answers;
    const ans = userAnswers ? userAnswers[qid] : undefined;
    if (ans === undefined || ans === null) continue;

    if (q.question_type === 'true/false') {
      const correctVal = Array.isArray(correct) ? correct[0] : correct;
      const userVal = typeof ans === 'boolean' ? ans : String(ans).toLowerCase() === 'true';
      if (Boolean(correctVal) === userVal) score += 1;
      continue;
    }

    // Normalizing to arrays of strings for comparison
    const correctSet = new Set((Array.isArray(correct) ? correct : [correct]).map(String));
    const answerSet = new Set((Array.isArray(ans) ? ans : [ans]).map(String));

    if (q.question_type === 'single-select') {
      if (answerSet.size === 1 && correctSet.size === 1) {
        const [a] = Array.from(answerSet);
        const [c] = Array.from(correctSet);
        if (a === c) score += 1;
      }
    } else if (q.question_type === 'multi-select') {
      if (answerSet.size === correctSet.size) {
        let allMatch = true;
        for (const c of correctSet) {
          if (!answerSet.has(c)) { allMatch = false; break; }
        }
        if (allMatch) score += 1;
      }
    }
  }
  return { score };
}

module.exports = { calculateScore };


