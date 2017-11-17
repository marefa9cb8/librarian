"use strict";

const electron = require("electron");
const { app, BrowserWindow, remote, Menu, Tray, nativeImage, shell} = electron;
let mainWindow;

//透過部分をクリック時に背景のアプリをクリックする
app.disableHardwareAcceleration()

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

function createWindow(){
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({
    width: 600,
    height: 430,
    transparent: true,
    frame: false,
    resizable: false,
    'node-integration': false
  });
}

// Electronの初期化完了後に実行
app.on('ready', function() {
  createWindow();
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //Developerモード
  //mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

//control.jsで実行
exports.openBrowser = function(URL) {
  shell.openExternal(URL);
}

const translate = require('google-translate-api');
exports.translation = function(txt) {
  return translate(txt,{});
}

const rp = require('request-promise');
exports.wikipedia = function(txt) {
  let options = {
    uri: 'https://ja.wikipedia.org/w/api.php',
    method: "GET",
    timeout: 30 * 1000,
    qs: {
      format : 'json',
      action : 'query',
      prop   : 'extracts',
      exintro: '',
      explaintext: '',
      titles : txt
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
  }
  return rp(options);
}
