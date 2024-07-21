using Microsoft.AspNetCore.SignalR;

namespace PictureSyncerSignalR.Hubs;

public class ImageHub : Hub
{
    
    public async Task UploadImage(byte[] fileData, string fileName)
    {
        var base64Image = Convert.ToBase64String(fileData);
        
        await Clients.All.SendAsync("ReceiveImage", base64Image, fileName);
    }
}