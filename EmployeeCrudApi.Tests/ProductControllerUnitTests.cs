using EmployeeCrudApi.Controllers;
using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;
using Moq;

namespace EmployeeCrudApi.Tests
{
    public class ProductControllerUnitTests
    {
        private ApplicationDbContext CreateInMemoryDb(string dbName)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task SetStock_Valid_UpdatesStock()
        {
            var db = CreateInMemoryDb("SetStock_Valid");
            db.Products.Add(new Product { Id = 1, Name = "P1", Stock = 0 });
            db.SaveChanges();

            var controller = new ProductController(db);
            var result = await controller.SetStock(1, new ProductController.StockDto { Amount = 5 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(5, prod.Stock);
        }

        [Fact]
        public async Task SetStock_InvalidRange_ReturnsBadRequest()
        {
            var db = CreateInMemoryDb("SetStock_InvalidRange");
            db.Products.Add(new Product { Id = 2, Name = "P2", Stock = 0 });
            db.SaveChanges();

            var controller = new ProductController(db);
            var result = await controller.SetStock(2, new ProductController.StockDto { Amount = 500 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task IncrementStock_Valid_Increments()
        {
            var db = CreateInMemoryDb("Inc_Valid");
            db.Products.Add(new Product { Id = 3, Name = "P3", Stock = 2 });
            db.SaveChanges();

            var controller = new ProductController(db);
            var result = await controller.IncrementStock(3, new ProductController.StockDto { Amount = 3 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(5, prod.Stock);
        }

        [Fact]
        public async Task DecrementStock_Valid_Decrements()
        {
            var db = CreateInMemoryDb("Dec_Valid");
            db.Products.Add(new Product { Id = 4, Name = "P4", Stock = 10 });
            db.SaveChanges();

            var controller = new ProductController(db);
            var result = await controller.DecrementStock(4, new ProductController.StockDto { Amount = 3 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(7, prod.Stock);
        }

        [Fact]
        public async Task IncrementStock_TooHigh_ReturnsBadRequest()
        {
            var db = CreateInMemoryDb("Inc_TooHigh");
            db.Products.Add(new Product { Id = 5, Name = "P5", Stock = 99 });
            db.SaveChanges();

            var controller = new ProductController(db);
            var result = await controller.IncrementStock(5, new ProductController.StockDto { Amount = 5 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_InvalidModel_ReturnsBadRequest()
        {
            var db = CreateInMemoryDb("InvalidModel");
            var controller = new ProductController(db);
            controller.ModelState.AddModelError("Name", "Required");

            var result = await controller.Create(new Product { Id = 10, Name = "" });
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
