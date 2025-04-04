const ExcelJS = require('exceljs');
const fs = require('fs');

const path = require('path');

async function exportExcelWithImages(jsonData, columnMapping) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Exported Data");
  
    const headers = Object.keys(columnMapping);
    sheet.addRow(headers);
  
    for (const rowData of jsonData) {
      const row = [];
  
      for (const key of headers) {
        if (key !== "img") {
          row.push(rowData[key] || "");
        }
      }
  
      const rowIndex = sheet.rowCount + 1;
      const newRow = sheet.addRow(row);
  
      if (rowData.img && rowData.img.startsWith("data:image/")) {
        const base64Data = rowData.img.split(';base64,').pop();
        const extension = rowData.img.match(/\/(.*?)\;/)[1] || "png";
  
        const imageId = workbook.addImage({
          base64: rowData.img,
          extension: extension,
        });
  
        const imgWidth = 100;
        const imgHeight = 100;
  
        sheet.addImage(imageId, {
          tl: { col: headers.indexOf("img"), row: rowIndex - 1 },
          ext: { width: imgWidth, height: imgHeight },
        });
  
        sheet.getRow(rowIndex).height = imgHeight * 0.75;
        const imgColumnIndex = headers.indexOf("img") + 1;
        sheet.getColumn(imgColumnIndex).width = imgWidth / 7;
      }
    }
  
    // 🔁 retourne un Buffer au lieu de l'enregistrer sur disque
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  

async function importExcelWithImages(buffer, columnMapping) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const sheet = workbook.worksheets[0];
    const jsonData = [];

    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowData = {};

        if (!columnMapping) {
            throw new Error("columnMapping parameter is required.");
        }
        for (const [key, colIndex] of Object.entries(columnMapping)) {
            rowData[key] = row.getCell(colIndex).value;
        }

        rowData.img = null;
        sheet.getImages().forEach((image) => {
            if (image.range.tl.nativeRow === rowNumber - 1) {
                const imgId = image.imageId;
                const img = workbook.model.media.find(m => m.index === imgId);
                
                if (img) {
                    rowData.img = `data:image/${img.extension};base64,${img.buffer.toString('base64')}`;
                }
            }
        });

        jsonData.push(rowData);
    });

    return jsonData;
}

module.exports = { importExcelWithImages, exportExcelWithImages }
