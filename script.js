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
function decodeAndShowQRData() {
   const fileInput = document.getElementById('qrInput');
   const reader = new FileReader();
   reader.onload = function() {
       const qr = new QRCode();
       qr.callback = function(err, result) {
           if (err) {
               alert("Error decoding QR Code: " + err);
           } else {
               if (result.data) {
                   document.getElementById('decodedQRData').innerText = "Decoded QR Data: " + result.data;
                   console.log("Decoded QR Data:", result.data);
               } else {
                   alert("No label data found in the QR Code.");
               }
           }
       };
       qr.decode(reader.result);
   };
   reader.readAsDataURL(fileInput.files[0]);
}
function appendDataToExcel() {
   const decodedData = document.getElementById('decodedQRData').innerText.replace("Decoded QR Data: ", "");
   const excelFile = document.getElementById('excelInput').files[0];
   const excelReader = new FileReader();
   excelReader.onload = (e) => {
       const originalWorkbook = XLSX.read(e.target.result, { type: 'binary' });
       const wsName = originalWorkbook.SheetNames[0];
       const originalWs = originalWorkbook.Sheets[wsName];
       // Convert original sheet to JSON
       const jsonData = XLSX.utils.sheet_to_json(originalWs, { header: 1 });
       console.log("Original Excel Data:", jsonData);
       // Assuming the decoded data is comma-separated as "header,data,header,data,..."
       const dataArray = decodedData.split(',');
       console.log("QR Code Data:", dataArray);
       const newDataRow = [];
       for (let i = 0; i < dataArray.length; i += 2) {
           newDataRow.push(dataArray[i + 1]); // push the data only
       }
       console.log("New Data Row:", newDataRow);
       jsonData.push(newDataRow);
       // Create a new workbook and add the updated sheet
       const newWorkbook = XLSX.utils.book_new();
       const newWs = XLSX.utils.aoa_to_sheet(jsonData);
       XLSX.utils.book_append_sheet(newWorkbook, newWs, wsName);
       const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
       const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
       const link = document.getElementById('downloadLinkExcel');
       link.href = URL.createObjectURL(blob);
       link.download = 'updated_excel.xlsx';
       link.style.display = 'block';
   };
   excelReader.readAsBinaryString(excelFile);
}
// Helper function to convert string to ArrayBuffer
function s2ab(s) {
   const buf = new ArrayBuffer(s.length);
   const view = new Uint8Array(buf);
   for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
   return buf;
}
