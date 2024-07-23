namespace PictureSyncerSignalR.Models;

public class ImageData
{
    public byte[]? ImageBinary { get; set; }
    public string ImageHeader { get; set; } = string.Empty;
}