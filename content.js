// Further improvements:
//   - Detect capitilisations, upper and lower cases -> DONE!
//   - Show all word changes
//   - Ability to clear each individual word

chrome.runtime.onMessage.addListener(gotMessage);

// Function saves users original word and replacement word so it can be used in the
// next session
function saveToLocal(original_word, replacement_word) {

  chrome.storage.local.get({words: []}, function (result) {
    
    // get list of exising word pairs (originals and replacement)
    let words_list = result.words;

    // add new word pair to list
    words_list.push({original: original_word, replacement: replacement_word});

    // overwrite old array in memeory, and save it as new one, with new pair appended
    chrome.storage.local.set({words: words_list}, function () {
        console.log('save successful')
    });
  });
}


// Replaces all the origional words on the current site with the original and saves the
// word pair for later
function replaceAndSaveWord(original, replacement){
  console.log('Replacing "' + original + '" to "' + replacement + '"');

  saveToLocal(original, replacement);

  // just a single replace word here
  replaceWord(original, replacement);

}

// Recieve message from popup (user interaction)
function gotMessage(message, sender, sendResponse){

    // check if message is to add a new word replacement pair, or remove all words
    if (message.d == "replace") {
      replaceAndSaveWord(message.original, message.replacement)
    } else if (message.d == "clear") {
      clearReplacements();
    }
}

// Checks entire document DOM and replaces all orignal words with their replacements
const replaceOnDocument = (pattern, string, {target = document.body} = {}) => {
  [
    target,
    ...target.querySelectorAll("*:not(script):not(noscript):not(style)")
  ].forEach(({childNodes: [...nodes]}) => nodes
    .filter(({nodeType}) => nodeType === document.TEXT_NODE)
    .forEach((textNode) => textNode.textContent = textNode.textContent.replace(pattern, string)));
};


// Modifies origional word and replacement to account for capital, upper case, lower case and 
// user input cases. 
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

// Goes through list of stored replacement word pairs and makes the replacements
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


// Clears all the replacements word pairs from memory
function clearReplacements(){
  console.log('Clearing')
  chrome.storage.local.clear(function(){
    console.log("Replacements Cleared");
  });
}

