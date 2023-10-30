// Function to generate a QR Code based on user input
function generateQR() {
   const data = document.getElementById('qr-input').value;
   const qrOutput = document.getElementById('qr-output');
   const downloadLink = document.getElementById('download-link');
   if (data.trim() === '') return;
   const typeNumber = 0;
   const errorCorrectionLevel = 'L';
   const qr = qrcode(typeNumber, errorCorrectionLevel);
   qr.addData(data);
   qr.make();
   qrOutput.src = qr.createDataURL(6);
   downloadLink.href = qrOutput.src;
   qrOutput.style.display = 'block';
   downloadLink.style.display = 'block';
}
// Function to read uploaded QR code and convert it to Excel
function readQR() {
   const fileInput = document.getElementById('qr-upload');
   const file = fileInput.files[0];
   if (file) {
       const reader = new FileReader();
       reader.onload = function(e) {
           const image = new Image();
           image.onload = function() {
               const canvas = document.createElement('canvas');
               canvas.width = image.width;
               canvas.height = image.height;
               const ctx = canvas.getContext('2d');
               ctx.drawImage(image, 0, 0);
               const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
               const code = jsQR(imageData.data, imageData.width, imageData.height);
               if (code) {
                   const qrResult = document.getElementById('qr-result');
                   qrResult.textContent = "QR Code Data: " + code.data;
                   // Convert QR data to Excel
                   const ws = XLSX.utils.json_to_sheet([{ 'QR Data': code.data }]);
                   const wb = XLSX.utils.book_new();
                   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                   const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                   // Provide download link for the Excel file
                   const blob = new Blob([new Uint8Array(excelData)], { type: 'application/octet-stream' });
                   const link = document.createElement('a');
                   link.href = window.URL.createObjectURL(blob);
                   link.download = 'qrcode_data.xlsx';
                   link.click();
               }
           };
           image.src = e.target.result;
       };
       reader.readAsDataURL(file);
   }
}
