using EmployeeCrudApi.Controllers;
using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
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

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
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

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
            var result = await controller.SetStock(2, new ProductController.StockDto { Amount = 500 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task IncrementStock_Valid_Increments()
        {
            var db = CreateInMemoryDb("Inc_Valid");
            db.Products.Add(new Product { Id = 3, Name = "P3", Stock = 2 });
            db.SaveChanges();

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
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

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
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

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
            var result = await controller.IncrementStock(5, new ProductController.StockDto { Amount = 5 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_InvalidModel_ReturnsBadRequest()
        {
            var db = CreateInMemoryDb("InvalidModel");
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);
            controller.ModelState.AddModelError("Name", "Required");

            var result = await controller.Create(new Product { Id = 10, Name = "" });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_DuplicateName_LogsWarning_WithMoq()
        {
            var db = CreateInMemoryDb("Dup_Log");
            db.Products.Add(new Product { Id = 1, Name = "Juan Perez" });
            db.SaveChanges();

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);

            var result = await controller.Create(new Product { Id = 2, Name = "Juan PEREZ" });
            Assert.IsType<BadRequestObjectResult>(result);

            logger.Verify(x => x.Log(
                It.Is<LogLevel>(l => l == LogLevel.Warning),
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString()!.Contains("Duplicate name attempted")),
                It.IsAny<Exception?>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()
            ), Times.AtLeastOnce());
        }

        private class ThrowingDbContext : ApplicationDbContext
        {
            public ThrowingDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
            public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            {
                throw new InvalidOperationException("DB error");
            }
        }

        [Fact]
        public async Task Create_WhenSaveThrows_PropagatesException()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("ThrowingDB")
                .Options;
            var db = new ThrowingDbContext(options);

            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);

            await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            {
                await controller.Create(new Product { Id = 9, Name = "John DOE" });
            });
        }

        [Fact]
        public async Task SetStock_NullDto_ReturnsBadRequest()
        {
            var db = CreateInMemoryDb("NullDto");
            db.Products.Add(new Product { Id = 30, Name = "P30", Stock = 1 });
            db.SaveChanges();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);

            var result = await controller.SetStock(30, null!);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_NotFound_ReturnsNotFound()
        {
            var db = CreateInMemoryDb("Update_NotFound");
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(db, logger.Object);

            var result = await controller.Update(new Product { Id = 999, Name = "X" });
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
