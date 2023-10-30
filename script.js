function generateQRCode() {
   const qrContent = document.getElementById('qrContent').value;
   const qrCanvas = document.getElementById('qrCanvas');
   const qr = qrcode(0, 'L');
   qr.addData(qrContent);
   qr.make();
   qrCanvas.innerHTML = qr.createImgTag(4);
}
function decodeImage() {
   const qrUpload = document.getElementById('qrUpload').files[0];
   const qrCanvas = document.getElementById('qrCanvas');
   const ctx = qrCanvas.getContext('2d');
   const img = new Image();
   img.src = URL.createObjectURL(qrUpload);
   img.onload = function() {
       qrCanvas.width = img.width;
       qrCanvas.height = img.height;
       ctx.drawImage(img, 0, 0);
       const imageData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
       const decodedData = jsQR(imageData.data, imageData.width, imageData.height);
       if (decodedData) {
           document.getElementById('decodedData').innerText = decodedData.data;
       } else {
           alert("Couldn't decode QR code.");
       }
   }
}
function saveToExcelClientSide(data) {
   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.json_to_sheet([data]);
   XLSX.utils.book_append_sheet(wb, ws, "Data");
   XLSX.write(wb, { bookType: 'xlsx', type: 'blob' }).then(function(blob) {
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'data.xlsx';
       a.click();
   });
}
function exportToExcel() {
   const data = document.getElementById('decodedData').innerText;
   saveToExcelClientSide({data: data});
}
