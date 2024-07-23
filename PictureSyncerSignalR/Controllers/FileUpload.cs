using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PictureSyncerSignalR.Hubs;
using PictureSyncerSignalR.Models;

namespace PictureSyncerSignalR.controllers;

[Route("api/[controller]")]
public class FileUploadController : Controller
{
    private readonly IHubContext<ImageHub> _hubContext;

    public FileUploadController(IHubContext<ImageHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [Route("files")]
    [HttpPost]
    public async Task<IActionResult> UploadFiles(List<IFormFile> files)
    {
        if (ModelState.IsValid)
        {
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await formFile.CopyToAsync(memoryStream);

                    var imageMessage = new ImageData()
                    {
                        ImageBinary = memoryStream.ToArray(),
                        ImageHeader = "data:" + formFile.ContentType + ";base64,"
                    };

                    await _hubContext.Clients.All.SendAsync("ReceiveImage", imageMessage.ImageBinary, imageMessage.ImageHeader);
                }
            }
        }

        return Ok();
    }
}