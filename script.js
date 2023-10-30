function generateQR() {
   const data = document.getElementById('qr-input').value;
   const qrOutput = document.getElementById('qr-output');
   const downloadLink = document.getElementById('download-link');
   if (data.trim() === '') return;
   let qr = new QRCode(qrOutput, {
       text: data,
       width: 128,
       height: 128
   });
   let img = qr._oDrawing._elImage; // Grab the image element from QRCode library
   setTimeout(() => {
       downloadLink.href = img.src; // Set the source for the download link after a short delay
   }, 200);
   downloadLink.style.display = 'block';
}
function convertToExcel() {
   const fileInput = document.getElementById('upload');
   const file = fileInput.files[0];
   if (!file) return;
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function() {
       // Decode the QR code
       const image = new Image();
       image.src = reader.result;
       image.onload = function() {
           const canvas = document.createElement('canvas');
           const context = canvas.getContext('2d');
           canvas.width = image.width;
           canvas.height = image.height;
           context.drawImage(image, 0, 0);
           // Use QRCode library to decode
           const decodedData = QRCode.decode(canvas.toDataURL('image/png'));
           // Convert decoded data to Excel and download
           // (for simplicity, assuming decodedData is comma-separated values)
           const blob = new Blob([decodedData], { type: 'application/vnd.ms-excel' });
           const url = URL.createObjectURL(blob);
           const excelLink = document.getElementById('excel-download-link');
           excelLink.href = url;
           excelLink.style.display = 'block';
       };
   }
}
