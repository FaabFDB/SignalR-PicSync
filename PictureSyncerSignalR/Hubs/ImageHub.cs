using Microsoft.AspNetCore.SignalR;
using PictureSyncerSignalR.Models;

namespace PictureSyncerSignalR.Hubs;

public class ImageHub : Hub
{
    
    public async Task UploadImage(byte[] fileData, string fileType, string fileName)
    {
        await Clients.All.SendAsync("ReceiveImage", fileData, fileName);
    }
}