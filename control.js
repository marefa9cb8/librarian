"use strict";

const main = require('electron').remote.require("./main");
let oldInputText = ""

function inputWord(){
  let inputText = $(this).val(); // 検索ボックスに入力された値  

  // 検索ボックスに値が入ってる場合
  if (inputText != '') {
    if (oldInputText === inputText){
      return;
    }
    console.log(inputText);
    //translation
    let translated_word;
    main.translation(inputText).then(res => {
      translated_word = res.text;
      $('#translation').text(translated_word);
    }).catch(err => {
      console.log(err);
      $('#translation').empty();
    });
    //meaning
    let content = "";
    main.wikipedia(inputText).then(res => {
      console.log(res)
      let query = JSON.parse(res).query;
      if (query && query.pages){
        for (let p in query.pages){
          content = query.pages[p].extract;
          if ( content ){
            content = content//.replace(/\n/g, '<br>');
          }
          else{
            content = "Not Found";
          }
        }
      }
      $('#meaning').text(content);
    }).catch(err => {
      console.log(err);
      $('#meaning').empty();
    });
    oldInputText = inputText;
  }else{
    oldInputText = ""
    $('#translation').empty();
    $('#meaning').empty();
  }
};
   
// inputWordの実行
$('#question').keyup(inputWord);

function SearchGoogle(){
  let queryText = $("#question").val();
  main.openBrowser("https://www.google.co.jp/search?q=" + queryText);
};