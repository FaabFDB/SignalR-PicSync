using PictureSyncerSignalR.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Builder services
builder.Services.AddSignalR(e =>
{
    e.MaximumReceiveMessageSize = 102400000;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


// app.MapGet("/", () => "Hello World!");
app.UseRouting();

// app.MapHub<ChatHub>("/chatHub");
app.MapHub<ImageHub>("/imageHub");

app.Run();