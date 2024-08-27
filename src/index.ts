import * as signalR from "@microsoft/signalr";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap'
import * as QRCode from 'qrcode'

// Create connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/imageHub")
    .build();


// Variables
const imageRow = document.getElementById('imageRow') as HTMLDivElement;
const qrCodecanvasIdName:string = "canvas-qrcode";
const qrCodeContIdName:string = "cont-qrcode";

let indexList: Array<number> = new Array<number>();
let chunkMax = 999999999;
let chunkReceived = 0;
let chunkArray : Array<string> = new Array<string>();
let url:string;

// Start the connection
connection.start()
    .then(() => {
        console.log('Now connected, connection ID=' + connection.connectionId);
        
        url = window.location.protocol + "//" + window.location.hostname + "/mobileIndex.html?destId=" + connection.connectionId;
        // const mobUrl = document.getElementById('mm-mobileurl');
        // mobUrl.setAttribute("href", "https://localhost:44397" + "/mobileIndex.html?destId=" + connection.connectionId);
        
        
        const qrParent = document.getElementById('cont-qrcode');
        const textNode = document.createElement('a');
        // textNode.href = "https://localhost:44397" + "/mobileIndex.html?destId=" + connection.connectionId;
        textNode.href = url;
        textNode.text = "Test Link";
        qrParent.appendChild(textNode);
        
        QRCode.toCanvas(url, { errorCorrectionLevel: "H"}, function (error, canvas) {
            if (error) throw error
            
            canvas.id += qrCodecanvasIdName;
            console.log(url);
            
            const QRCodeElement = document.getElementById(qrCodeContIdName);
            QRCodeElement.appendChild(canvas);
            
        });
    })
    .catch(err => console.error(err.toString()));
    

connection.on("processData", function (data: string) 
{
    alert(data)
});

connection.on("mobileConnected", function () 
{
    console.log("Should notify the mobile device is connected. And hide the QR code.");
    alert("Phone connected.")

    // $("mm-status").text("Mobile phone connected.. Waiting for image")

    const qrCanvasElement  = document.getElementById(qrCodeContIdName);
    if (qrCanvasElement)
        // qrCodeCanvas.style.visibility = 'hidden';
        qrCanvasElement.style.display = 'none';
});

connection.on("receivePreviewImage", function (dataUrl:string, index:number) 
{
    const row: HTMLElement = document.getElementById("imageRow");

    row.appendChild(createImageCol(dataUrl, index));
    
    indexList.push(index);
});

connection.on("receiveFirstChunk", function (count:number, chunk:string) 
{
    let index:number;
    
    if (indexList.length != 0) {
        index = indexList[indexList.length - 1];
        const queryToSearch = `.col-2[data-index="${index}"]`;
        // const progress = document.querySelector(queryToSearch).lastElementChild;
        // const progressBar = progress.firstElementChild as HTMLElement;

        var specificElement = document.querySelector(queryToSearch);
        var progressBar = specificElement.querySelector('.progress-bar') as HTMLElement;
        
        // console.log(test);
        // const progress = test.closest('.progress') as HTMLDivElement;
        progressBar.style.width = ("0%");
        
        chunkMax = count;
        chunkReceived = 1;
        chunkArray[0] = chunk;
        console.log("chunkArray 0: " + chunkArray[0]);
    }
    else {
        console.log("Index out of Range");
    }
});

connection.on("receiveChunk", function (index:number, chunk:string) 
{
    const indexOfList = indexList[indexList.length - 1];
    const queryToSearch = `.col-2[data-index="${indexOfList}"]`;
    const colElement = document.querySelector(queryToSearch);
    const progressBar = colElement.querySelector('.progress-bar') as HTMLElement;

    if (progressBar) {
        chunkArray[index] = chunk;
        chunkReceived++;
        // console.log(chunk);

        let perc = (chunkReceived === chunkMax) ? 100 : Math.ceil((chunkReceived/chunkMax)*100);
        progressBar.style.width = (perc + "%");
        progressBar.textContent = (perc.toString() + "%");
        progressBar.ariaValueNow = `${perc}`;

        if (chunkReceived == chunkMax)
        {
            // let dataUrl = "data:image/png;base64,";
            let dataUrl = "";
            for (let i = 0; i < chunkMax; i++)
            {
                dataUrl += chunkArray[i];
            }
            const imgElement = document.querySelector(queryToSearch + " img");
            imgElement.setAttribute("src", dataUrl);
        }
    } else {
        console.log("progress bar not found.");
    }
    
});

imageRow.addEventListener('click', (evt) => {
    const target = evt.target as HTMLElement;
    
    if (target.classList.contains('delete-btn')) {
        const imageCol = target.closest('.col-2');
        
        if (imageCol) {
            imageCol.remove();
        }
    }
});

function createImageCol(dataUrl:string, index:number) : HTMLDivElement {
    let img : HTMLImageElement= document.createElement("img");
    let deleteButton = document.createElement('button');
    let progressBarWrapper = document.createElement('div');
    let progressBar = document.createElement('div');
    let col : HTMLDivElement = document.createElement('div');

    // Col variables
    col.className += "col-2";
    col.dataset.index = `${index}`;
    
    // Img variables
    img.setAttribute("src", dataUrl);
    img.style.height = "100%";
    img.style.width = "100%";
    // img.dataset.index = `${index}`;

    // Delete button variables
    deleteButton.className += "btn btn-danger delete-btn";
    deleteButton.textContent = 'X';

    // Progress bar Wrapper
    progressBarWrapper.className += "progress";

    // Progress bar
    progressBar.className += "progress-bar";
    progressBar.role = "progressbar";
    progressBar.ariaValueNow = "0";
    progressBar.ariaValueMin = "0";
    progressBar.ariaValueMax = "100";


    progressBarWrapper.appendChild(progressBar);

    col.appendChild(img);
    col.appendChild(deleteButton);
    col.appendChild(progressBarWrapper);
    
    return col;
}























// const mobModal = document.getElementById("mobileModal");
// mobModal.addEventListener('hidden.bs.modal', function (e) : void {
//     connection.stop().catch(err => console.error(err.toString()));
//     $(qrCodeContIdName).hide();
// });

// mobModal.addEventListener('hidden.bs.modal', onclick
// });
// $('#mobileModal').on('hidden.bs.modal', function (e) : void {
//     connection.stop().catch(err => console.error(err.toString()));
//     $('#qrCodeContIdName').hide();
// });

// $('mobileModal').on('shown.bs.modal', function (e) {
//     // (document.getElementById('mm-button')).addEventListener('shown.bs.modal', (e) => {
//     $('mm-status').text("Connecting to communication hub...");
//     connection.start()
//         .then(function () {
//             console.log('Now connected, connection ID=' + connection.connectionId);
//
//             $("$mm-status").text("Connected to hub...");
//
//             var img = $('qrCodeContIdName');
//             // var url = window.location.protocol+"//"+window.location.hostname + "/mobileclient.html?destId=" + connection.connectionId;
//
//             img.attr("href", url);
//             img.show();
//
//             $("mm-mobileurl").attr("href", url);
//             $("mm-status").text("Waiting for mobile connection...");
//         })
//         .catch(function () { console.log('Could not Connect!') });
// });
//
// (document.getElementById('mm-button')).addEventListener('click', () => {
//     const mobileModalElem = document.getElementById('mobileModal');
//     if (mobileModalElem)
//     {
//         const modalInstance = bootstrap.Modal.getInstance(mobileModalElem);
//     }
// });