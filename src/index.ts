import * as signalR from "@microsoft/signalr";
import 'bootstrap/dist/css/bootstrap.min.css';

// Create connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/imageHub")
    .build();

// Start the connection
connection.start().catch(err => console.error(err.toString()));

connection.on("ReceiveImage", function (imageBinary: ArrayBuffer, imageHeader: string) {
    const img = document.createElement("img");
    img.src = imageHeader + imageBinary;
    img.className += "col";
    img.style.width = '15%';
    img.style.height = 'auto';
    
    document.getElementById("imageRow").appendChild(img);
});

// Handle receiving the image
document.getElementById("uploadButton").addEventListener("click", function () {
    const files = (<HTMLInputElement>document.getElementById("fileInput")).files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    fetch('/api/fileupload/files', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to upload files");
        }
    }).catch(error => console.error('Error:', error));
});