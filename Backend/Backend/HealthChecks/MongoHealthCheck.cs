using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Backend.HealthChecks
{
    public class MongoHealthCheck : IHealthCheck
    {
        private readonly IConfiguration _config;

        public MongoHealthCheck(IConfiguration config)
        {
            _config = config;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var connectionString = _config.GetConnectionString("MongoDb");
                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    return HealthCheckResult.Unhealthy("MongoDB connection string is not configured.");
                }

                var databaseName = _config["MongoDbSettings:DatabaseName"];
                if (string.IsNullOrWhiteSpace(databaseName))
                {
                    // try to parse from connection string
                    databaseName = MongoUrl.Create(connectionString).DatabaseName;
                }

                var client = new MongoClient(connectionString);
                var database = client.GetDatabase(databaseName ?? "admin");

                // simple ping command
                var command = new BsonDocument("ping", 1);
                await database.RunCommandAsync<BsonDocument>(command, cancellationToken: cancellationToken);

                return HealthCheckResult.Healthy("MongoDB is reachable.");
            }
            catch (System.Exception ex)
            {
                return HealthCheckResult.Unhealthy("MongoDB check failed", ex);
            }
        }
    }
}
