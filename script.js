function addField() {
   let container = document.getElementById('inputFields');
   let newField = document.createElement('div');
   newField.className = "field-container";
   newField.innerHTML = `
<input type="text" placeholder="Field Name" class="field-name">
<input type="text" placeholder="Field Value" class="field-value">
   `;
   container.appendChild(newField);
}
function generateQRCode() {
   let fieldNames = document.querySelectorAll('.field-name');
   let fieldValues = document.querySelectorAll('.field-value');
   let data = [];
   for (let i = 0; i < fieldNames.length; i++) {
       data.push(`${fieldNames[i].value}: ${fieldValues[i].value}`);
   }
   let qrcode = new QRCode(document.getElementById("qrcode"), {
       text: data.join('\n'),
       width: 128,
       height: 128,
       colorDark: "#000000",
       colorLight: "#ffffff",
       correctLevel: QRCode.CorrectLevel.L
   });
   setTimeout(() => {
       let downloadLink = document.getElementById('downloadLink');
       downloadLink.href = document.querySelector('#qrcode img').src;
       downloadLink.style.display = 'block';
   }, 100);
}
function appendDataToExcel() {
   const qrFile = document.getElementById('qrInput').files[0];
   const excelFile = document.getElementById('excelInput').files[0];
   const qrReader = new FileReader();
   const excelReader = new FileReader();
   let qrData;
   qrReader.onload = async (e) => {
       qrData = e.target.result;
       excelReader.readAsBinaryString(excelFile);
   };
   excelReader.onload = (e) => {
       const workbook = XLSX.read(e.target.result, { type: 'binary' });
       const ws = workbook.Sheets[workbook.SheetNames[0]];
       const csvData = XLSX.utils.sheet_to_csv(ws);
       const combinedData = csvData + '\n' + qrData;
       const newWs = XLSX.utils.csv_to_sheet(combinedData);
       workbook.Sheets[workbook.SheetNames[0]] = newWs;
       const updatedExcel = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
       const blob = new Blob([updatedExcel], { type: 'application/octet-stream' });
       const link = document.getElementById('downloadLinkExcel');
       link.href = URL.createObjectURL(blob);
       link.download = 'updated_excel.xlsx';
       link.style.display = 'block';
   };
   qrReader.readAsDataURL(qrFile);
}
