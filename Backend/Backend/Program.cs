using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Repositories;
using Backend.HealthChecks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Linq;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
}));

builder.Services.AddSingleton<Backend.Services.MongoDbService>();
builder.Services.AddSingleton<Backend.Services.CounterService>();
builder.Services.AddScoped<IProductRepository, Backend.Repositories.MongoProductRepository>();


builder.Services.AddControllers();

// Health checks: MongoDB readiness
builder.Services.AddHealthChecks()
    .AddCheck<MongoHealthCheck>("mongodb");
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyPolicy");


// Serve static files from wwwroot (so /admin/index.html is available)
// Serve static files (frontend Angular y admin)
app.UseDefaultFiles(); // busca index.html automáticamente en wwwroot
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors("MyPolicy");
app.UseAuthorization();

app.MapControllers();

// Health endpoint (returns simple status; pipeline uses this to validate deployments)
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var payload = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description
            })
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
});

// Sirve el tester admin en /admin
app.MapGet("/admin", context =>
{
    context.Response.Redirect("/admin/index.html");
    return Task.CompletedTask;
});

// Para rutas del frontend Angular (SPA)
app.MapFallbackToFile("index.html");

app.Run();
