import sw from 'stopword';
import natural from 'natural';

export function uniqueWordList(entries, removeStopWords = true) {
  const tokenizer = new natural.WordTokenizer();
  const unique = new Set();
  entries.forEach((entry) =>
    tokenizer
      .tokenize(entry)
      .forEach((e) => unique.add(natural.PorterStemmer.stem(e))),
  );
  // console.log(result);
  // return result;
}
