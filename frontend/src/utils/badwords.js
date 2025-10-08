const BAD_WORDS = ['badword1', 'offensive', 'inapropiado'];

export function containsBadWord(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return BAD_WORDS.some((w) => {
    const ww = w.toLowerCase();
    return new RegExp(`\\b${ww}\\b`, 'i').test(lower) || lower.includes(ww);
  });
}

export default { BAD_WORDS, containsBadWord };
