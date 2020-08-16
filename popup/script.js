// Add callback functions for when submit buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("replacement-submit").addEventListener("click", updateText);
    document.getElementById("clear-replacements").addEventListener("click", clearReplacements);
});


// Sends message to content script to add new replacement word pair and update the text accordingly
function updateText() {
    console.log('replace words')
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        msg = {
            d: "replace",
            original: document.getElementById("original-word").value,
            replacement: document.getElementById("replacement-word").value,
        }
        chrome.tabs.sendMessage(activeTab.id, msg);
    });
}

// Sends message to content script to add clear all replacement word pairs
function clearReplacements(){
    console.log('clear replacements');
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let activeTab = tabs[0];
        msg = {
            d: "clear"
        }
        chrome.tabs.sendMessage(activeTab.id, msg);
    });
}