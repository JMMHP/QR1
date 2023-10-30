// Generate QR code based on user input
document.getElementById('generateQRBtn').addEventListener('click', async () => {
   const content = document.getElementById('qrContent').value;
   const canvas = document.getElementById('qrCanvas');
   await QRCode.toCanvas(canvas, content);
   const link = document.getElementById('downloadQRLink');
   link.href = canvas.toDataURL();
   link.download = 'generated_qr.png';
   link.style.display = 'block';
});
// Upload and decode QR code
document.getElementById('qrInput').addEventListener('change', async (event) => {
   const file = event.target.files[0];
   const reader = new FileReader();
   reader.onload = async (e) => {
       const decoded = await QRCode.toDataURL(e.target.result);
       console.log('Decoded QR:', decoded);
       // Note: You can store this decoded data or display it on the page.
   };
   reader.readAsDataURL(file);
});
// Upload Excel, append QR data, and download updated Excel
document.getElementById('appendDataBtn').addEventListener('click', () => {
   const qrFile = document.getElementById('qrInput').files[0];
   const excelFile = document.getElementById('excelInput').files[0];
   const qrReader = new FileReader();
   const excelReader = new FileReader();
   let qrData;
   qrReader.onload = async (e) => {
       qrData = await QRCode.toDataURL(e.target.result);
       excelReader.readAsBinaryString(excelFile);
   };
   excelReader.onload = (e) => {
       const workbook = XLSX.read(e.target.result, { type: 'binary' });
       // Assuming QR data is CSV and the first worksheet of Excel is the target
       const ws = workbook.Sheets[workbook.SheetNames[0]];
       const csvData = XLSX.utils.sheet_to_csv(ws);
       const combinedData = csvData + '\n' + qrData;
       const newWs = XLSX.utils.csv_to_sheet(combinedData);
       // Update the workbook and write it back to Excel
       workbook.Sheets[workbook.SheetNames[0]] = newWs;
       const updatedExcel = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
       const blob = new Blob([updatedExcel], { type: 'application/octet-stream' });
       const link = document.getElementById('downloadLink');
       link.href = URL.createObjectURL(blob);
       link.download = 'updated_excel.xlsx';
       link.style.display = 'block';
   };
   qrReader.readAsDataURL(qrFile);
});
