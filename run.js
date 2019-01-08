// var langSheet = require('./shit.json');
var fs = require('fs');
var config = require('./config/config.json')
var request = require("request")

var i
var row = 00
var langCol = []
var listSheetObj = []
var stringRes = {}
var objLangArray = []

request({
    url: config.link_json,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        convertJsonToObject(body)
    }
})

function convertJsonToObject(langSheet) {
    var count = 1
    for (i = 0; i < langSheet.feed.entry.length; i++) {
        var rowJSON = langSheet.feed.entry[i].gs$cell.row
        if (row == rowJSON) { }
        else if (langSheet.feed.entry[i].gs$cell.col < 4) {
            //create file lang name
            createLanguage(langSheet.feed.entry[i].gs$cell, result => {
                langCol.push(result)
            })
            //make obj for ez to read
            createObject(langSheet.feed.entry[i], cellObj => {
                listSheetObj.push(cellObj)
            })
        }
        count++
    }

    listSheetObj.forEach(word => {
        createStringFile(word)
    });
}

// pull name of language from google sheet at row 1 
function createLanguage(cell, callback) {
    if (cell.row == 1)
        callback(cell.inputValue)
}

// create object follow langCol arr
function createObject(value, callback) {
    callback(
        {
            row: value.gs$cell.row,
            col: value.gs$cell.col,
            value: value.gs$cell.inputValue
        }
    )
}

function createStringFile(path, data) {
    var count = 1
    var langData = "<resources>\n"
    for (i = 0; i < objLangArray.length; i++) {
        console.log("Creating de sheet >>> " + langData)
        langData = langData + "<string name=\"" + data.id + "\">" + data.value + "</string>\n"
        count++
    }
    langData += "</resources>"

    // fs.writeFileSync(path, langData, function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    console.log("=============================================")
}