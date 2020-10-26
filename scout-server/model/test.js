require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

use.load().then(model => {
  const sentences = [
    'This is a longer example with multiple sentances. See this is the second sentance',
    'How are you?',
  ];
  model.embed(sentences).then(embeddings => {
    embeddings.print(true /* verbose */);
  });
});
