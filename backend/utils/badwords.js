// Small list of prohibited words and helper to detect them
const BAD_WORDS = [
  // keep minimal and configurable
  'badword1',
  'offensive',
  'inapropiado'
];

function containsBadWord(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return BAD_WORDS.some((w) => {
    const ww = w.toLowerCase();
    // match whole word or substring depending on policy; use word boundary
    return new RegExp(`\\b${ww}\\b`, 'i').test(lower) || lower.includes(ww);
  });
}

module.exports = {
  BAD_WORDS,
  containsBadWord,
};
