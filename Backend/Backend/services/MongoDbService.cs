using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration config)
        {
            var connectionString = config.GetConnectionString("MongoDb");
            var mongoClient = new MongoClient(connectionString);
            _database = mongoClient.GetDatabase("MyDB"); // mismo nombre que pusiste en la URI
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }
    }
}
