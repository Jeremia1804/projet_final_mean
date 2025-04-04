const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require("path");


const importXLSX = function(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    return jsonData;
};


const exportXLSX = async function (jsonData, title = "Title") {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return buffer;
}

module.exports = { importXLSX, exportXLSX }