namespace PictureSyncerSignalR.Models;

public class ImageMessage
{
    public byte[]? ImageBinary { get; set; }
    public string ImageHeader { get; set; } = string.Empty;
}