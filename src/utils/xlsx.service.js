const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require("path");


const importXLSX = function(filePath){
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    fs.unlinkSync(filePath);
    return jsonData
}


const exportXLSX = async function (jsonData, filename = "file", title = "Title"){
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    const filePath = path.join(__dirname, `${filename}.xlsx`);

    await XLSX.writeFile(workbook, filePath);
    return filePath
}

module.exports = { importXLSX, exportXLSX }