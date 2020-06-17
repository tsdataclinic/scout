import sw from 'stopword';
import natural from 'natural';

export function uniqueWordList(entries, removeStopWords = true) {
  var tokenizer = new natural.WordTokenizer();
  const unique = new Set();
  entries.forEach((entry) =>
    tokenizer
      .tokenize(entry)
      .forEach((e) => unique.add(natural.PorterStemmer.stem(e))),
  );
  debugger;
  //console.log(result);
  // return result;
}
