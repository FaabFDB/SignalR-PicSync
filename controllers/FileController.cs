using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PictureSyncerSignalR.Hubs;
using PictureSyncerSignalR.Models;

namespace PictureSyncerSignalR.controllers;

[Route("api/[controller]")]
public class FileController : Controller
{
    private readonly IHubContext<ImageHub> _hubContext;

    public FileController(IHubContext<ImageHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [Route("files")]
    [HttpPost]
    // [ServiceFilter(typeof(ValidateAntiForgeryTokenAttribute))]
    public async Task<IActionResult> UploadFiles(List<IFormFile> files)
    {
        if (ModelState.IsValid)
        {
            // long size = files.Sum(f => f.Length);

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await formFile.CopyToAsync(memoryStream);

                    var imageMessage = new ImageMessage
                    {
                        ImageHeader = "data:" + formFile.ContentType + ";base64,",
                        ImageBinary = memoryStream.ToArray()
                    };

                    await _hubContext.Clients.All.SendAsync("ImageMessage", imageMessage);
                }
            }
        }

        return Redirect("/FileClient/Index");
    }
}