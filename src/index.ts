import * as signalR from "@microsoft/signalr";

// Create connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/imageHub")
    .build();

// Start the connection
connection.start().catch(err => console.error(err.toString()));

// Handle receiving the image
connection.on("ReceiveImage", (base64Image: string, fileName: string) => {
    const img = document.createElement("img");
    img.src = `data:image/png;base64,${base64Image}`;
    img.alt = fileName;
    document.getElementById("imagesContainer")?.appendChild(img);
});

// Upload image function
async function uploadImage(file: File) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);

        try {
            await connection.invoke("UploadImage", byteArray, file.name);
            console.log("Image uploaded successfully.");
        } catch (err) {
            console.error("Error uploading image: ", err);
        }
    };

    reader.readAsArrayBuffer(file);
}

// Event listener for file input
document.getElementById("fileInput")?.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        uploadImage(target.files[0]);
    }
});