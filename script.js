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
           if(err) {
               alert("Error decoding QR Code: " + err);
           } else {
               if(result.data) {
                   document.getElementById('decodedQRData').innerText = "Decoded QR Data: " + result.data;
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
       const workbook = XLSX.read(e.target.result, { type: 'binary' });
       const ws = workbook.Sheets[workbook.SheetNames[0]];
       const qrDataParts = decodedData.split(',');
       let newRow = {};
       for(let i = 0; i < qrDataParts.length; i += 2) {
           if(qrDataParts[i] && qrDataParts[i+1]) {
               newRow[qrDataParts[i].trim()] = qrDataParts[i+1].trim();
           }
       }
       XLSX.utils.sheet_add_json(ws, [newRow], {skipHeader: true, origin: -1});
       const updatedExcel = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
       const blob = new Blob([updatedExcel], { type: 'application/octet-stream' });
       const link = document.getElementById('downloadLinkExcel');
       link.href = URL.createObjectURL(blob);
       link.download = 'updated_excel.xlsx';
       link.style.display = 'block';
   };
   excelReader.readAsBinaryString(excelFile);
}
