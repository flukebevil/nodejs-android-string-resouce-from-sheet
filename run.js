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
    langCol.forEach((lang, index) => {
        createStringFile(listSheetObj, index + 2, config.file_name + '-' + lang)
    });
}

// pull name of language from google sheet at row 1 
function createLanguage(cell, callback) {
    if (cell.row == 1 && cell.inputValue != 'id')
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

// make android resource string file
function createStringFile(data, lang, path) {
    var langData = "<resources>\n"
    for (i = 1; i < data.length; i++) {
        if (data[i].col == 1)
            langData = langData + "<string name=\"" + data[i].value + "\">"
        if (data[i].col == lang)
            if (data[i].row > 1)
                langData = langData + data[i].value + "</string>\n"

    }
    langData += "</resources>"

    // create and write to file
    fs.writeFileSync(path, langData, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    console.log(langData)
}