// Further improvements:
//   - Detect capitilisations, upper and lower cases -> DONE!
//   - Show all word changes
//   - Ability to clear each individual word

chrome.runtime.onMessage.addListener(gotMessage);


function saveToLocal(original_word, replacement_word) {
  // console.log('saving to local');
  chrome.storage.local.get({words: []}, function (result) {
    // the input argument is ALWAYS an object containing the queried keys
    // so we select the key we need
    let words_list = result.words;
    words_list.push({original: original_word, replacement: replacement_word});
    // set the new array value to the same key
    chrome.storage.local.set({words: words_list}, function () {
        // you can use strings instead of objects
        // if you don't  want to define default values

        // chrome.storage.local.get('words', function (result) {
        //     console.log(result.words);
        // });
    });
  });
}

function replaceAndSaveWord(original, replacement){
  console.log('Replacing "' + original + '" to "' + replacement + '"');

  saveToLocal(original, replacement);

  // just a single replace word here
  replaceWord(original, replacement);

}

function gotMessage(message, sender, sendResponse){

    if (message.d == "replace") {
      replaceAndSaveWord(message.original, message.replacement)
    } else if (message.d == "clear") {
      clearReplacements();
    }
}


const replaceOnDocument = (pattern, string, {target = document.body} = {}) => {
  // Handle `string` — see the last section
  [
    target,
    ...target.querySelectorAll("*:not(script):not(noscript):not(style)")
  ].forEach(({childNodes: [...nodes]}) => nodes
    .filter(({nodeType}) => nodeType === document.TEXT_NODE)
    .forEach((textNode) => textNode.textContent = textNode.textContent.replace(pattern, string)));
};

function replaceWord(original, replacement) {
  // replacing word as user input
  replaceOnDocument(new RegExp("\\b"+original+"\\b","g"), replacement);

  // replacing upper case words
  let upperCase_original = original.toUpperCase();
  let upperCase_replacement = replacement.toUpperCase();
  replaceOnDocument(new RegExp("\\b"+upperCase_original+"\\b","g"), upperCase_replacement);

  // replacing lower case words
  let lowerCase_original = original.toLowerCase();
  let lowerCase_replacement = replacement.toLowerCase();
  replaceOnDocument(new RegExp("\\b"+lowerCase_original+"\\b","g"), lowerCase_replacement);

  // replacing sentence case words
  let capitalized_original = original.charAt(0).toUpperCase() + original.slice(1);
  let capitalized_replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
  replaceOnDocument(new RegExp("\\b"+capitalized_original+"\\b","g"), capitalized_replacement);

  
}

function replaceWordsOnStartUp() {

  chrome.storage.local.get('words', function (result) {
    let word_list = result.words;

    if (word_list){
      // console.log('word list');
      // console.log(word_list);
      for (let i=0; i<word_list.length; i++) {
        let replacementPair = word_list[i];

        console.log('Replacing "' + replacementPair.original + '" to "' + replacementPair.replacement + '"');
        replaceWord(replacementPair.original, replacementPair.replacement)
      }
    }
    
  });
} 

replaceWordsOnStartUp();

function clearReplacements(){
  console.log('Clearing')
  chrome.storage.local.clear(function(){
    console.log("Replacements Cleared");
  });
}

