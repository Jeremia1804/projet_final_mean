const ExcelJS = require('exceljs');
const fs = require('fs');

const path = require('path');

async function exportExcelWithImages(jsonData, columnMapping) {
    const outputFilePath = new Date().toISOString() + "_file_xlx.xlsx"
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Exported Data");

    const headers = Object.keys(columnMapping);
    sheet.addRow(headers);

    const imageFolder = "exported_images";
    if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder, { recursive: true });
    }

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
            const imagePath = path.join(imageFolder, `image_${rowIndex}.${extension}`);

            await fs.writeFileSync(imagePath, base64Data, { encoding: "base64" });

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

            fs.unlinkSync(imagePath);
        }
    }

    await workbook.xlsx.writeFile(outputFilePath);
    return outputFilePath
}


async function importExcelWithImages(filePath, columnMapping) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
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
