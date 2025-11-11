using ProductCrudApi.Controllers;
using ProductCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Backend.Repositories;

namespace ProductCrudApi.Tests
{
    public class ProductControllerUnitTests
    {
        private class FakeProductRepository : IProductRepository
        {
            private readonly List<Product> _items = new();

            public FakeProductRepository(IEnumerable<Product> seed = null)
            {
                if (seed != null) _items.AddRange(seed);
            }

            public Task<Product> CreateAsync(Product product)
            {
                if (product.Id == 0)
                {
                    product.Id = _items.Any() ? _items.Max(x => x.Id) + 1 : 1;
                }
                _items.Add(product);
                return Task.FromResult(product);
            }

            public Task<bool> DeleteAsync(int id)
            {
                var idx = _items.FindIndex(x => x.Id == id);
                if (idx >= 0) { _items.RemoveAt(idx); return Task.FromResult(true); }
                return Task.FromResult(false);
            }

            public Task<List<Product>> GetAllAsync() => Task.FromResult(_items.ToList());

            public Task<Product> GetByIdAsync(int id) => Task.FromResult(_items.FirstOrDefault(x => x.Id == id));

            public Task<Product> UpdateAsync(Product product)
            {
                var idx = _items.FindIndex(x => x.Id == product.Id);
                if (idx < 0) return Task.FromResult<Product>(null);
                _items[idx] = product;
                return Task.FromResult(product);
            }
        }

        // =======================================
        // CRUD BASIC TESTS
        // =======================================

        [Fact]
        public async Task GetAll_ReturnsListOfProducts()
        {
            // Arrange
            var repo = new FakeProductRepository(new[] {
                new Product { Id = 1, Name = "John DOE" },
                new Product { Id = 2, Name = "Jane DOE" }
            });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John DOE", result[0].Name);
            Assert.Equal("Jane DOE", result[1].Name);
        }

        [Fact]
        public async Task GetById_ReturnsProductById()
        {
            // Arrange
            var repo = new FakeProductRepository(new[] { new Product { Id = 1, Name = "John DOE" } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("John DOE", result.Name);
        }

        [Fact]
        public async Task Create_AddsProduct()
        {
            // Arrange
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var newProduct = new Product { Id = 3, Name = "New Product" };

            // Act
            var createResult = await controller.Create(newProduct);

            // Assert
            var list = await repo.GetAllAsync();
            var product = list.FirstOrDefault(x => x.Id == 3);
            Assert.NotNull(product);
            // The controller formats names; ensure it's set (case-insensitive check)
            Assert.Equal("New PRODUCT", product.Name);
        }

        [Fact]
        public async Task Update_UpdatesProduct()
        {
            // Arrange
            var existingProduct = new Product { Id = 1, Name = "Old NAME" };
            var repo = new FakeProductRepository(new[] { existingProduct });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var updatedProduct = new Product { Id = 1, Name = "Updated Name" };

            // Act
            await controller.Update(updatedProduct);

            // Assert
            var list = await repo.GetAllAsync();
            var product = list.FirstOrDefault(x => x.Id == 1);
            Assert.NotNull(product);
            Assert.Equal("Updated NAME", product!.Name);
        }

        [Fact]
        public async Task Delete_RemovesProduct()
        {
            // Arrange
            var productToDelete = new Product { Id = 1, Name = "John Doe" };
            var repo = new FakeProductRepository(new[] { productToDelete });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            // Act
            await controller.Delete(1);

            // Assert
            var list = await repo.GetAllAsync();
            Assert.DoesNotContain(list, x => x.Id == 1);
        }

        [Fact]
        public async Task Delete_NotFound_ReturnsNotFound()
        {
            // Arrange
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            // Act
            var result = await controller.Delete(12345);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        // =======================================
        // NAME VALIDATION TESTS
        // =======================================

        [Fact]
        public async Task Create_Rejects_DuplicateName()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 1, Name = "Existing User" } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var newProduct = new Product { Id = 2, Name = "existing user" }; // different case

            var result = await controller.Create(newProduct);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_Formats_Name_As_GivenAndUppercaseSurname()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var newProduct = new Product { Id = 5, Name = "juan carlos chamizo" };
            var result = await controller.Create(newProduct);

            Assert.IsType<OkObjectResult>(result);
            var list = await repo.GetAllAsync();
            var stored = list.FirstOrDefault(x => x.Id == 5);
            Assert.Equal("Juan Carlos CHAMIZO", stored!.Name);
        }

        [Fact]
        public async Task Create_Rejects_Names_With_Digits()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var newProduct = new Product { Id = 6, Name = "John D0e" };
            var result = await controller.Create(newProduct);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_Rejects_Excessive_Repeats()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var newProduct = new Product { Id = 7, Name = "Juuuuaannnn Perez" };
            var result = await controller.Create(newProduct);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_DuplicateName_LogsWarning_WithMoq()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 1, Name = "Juan Perez" } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

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

        [Fact]
        public async Task Create_InvalidModel_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            controller.ModelState.AddModelError("Name", "Required");

            var result = await controller.Create(new Product { Id = 10, Name = "" });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_NotFound_ReturnsNotFound()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Update(new Product { Id = 999, Name = "X" });
            Assert.IsType<NotFoundResult>(result);
        }

        // =======================================
        // STOCK MANAGEMENT TESTS
        // =======================================

        [Fact]
        public async Task SetStock_Valid_UpdatesStock()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 1, Name = "P1", Stock = 0 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var result = await controller.SetStock(1, new ProductController.StockDto { Amount = 5 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(5, prod.Stock);
        }

        [Fact]
        public async Task SetStock_InvalidRange_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 2, Name = "P2", Stock = 0 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var result = await controller.SetStock(2, new ProductController.StockDto { Amount = 500 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task IncrementStock_Valid_Increments()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 3, Name = "P3", Stock = 2 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var result = await controller.IncrementStock(3, new ProductController.StockDto { Amount = 3 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(5, prod.Stock);
        }

        [Fact]
        public async Task DecrementStock_Valid_Decrements()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 4, Name = "P4", Stock = 10 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var result = await controller.DecrementStock(4, new ProductController.StockDto { Amount = 3 });
            var ok = Assert.IsType<OkObjectResult>(result);
            var prod = Assert.IsType<Product>(ok.Value);
            Assert.Equal(7, prod.Stock);
        }

        [Fact]
        public async Task IncrementStock_TooHigh_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 5, Name = "P5", Stock = 99 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);
            var result = await controller.IncrementStock(5, new ProductController.StockDto { Amount = 5 });
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SetStock_NullDto_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository(new[] { new Product { Id = 30, Name = "P30", Stock = 1 } });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.SetStock(30, null!);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        // =======================================
        // PRICE VALIDATION TESTS
        // =======================================

        [Fact]
        public async Task Create_NegativePrice_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Create(new Product 
            { 
                Id = 0, 
                Name = "Test Product", 
                Stock = 10, 
                Price = -5 
            });

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var error = badRequest.Value;
            Assert.NotNull(error);
        }

        [Fact]
        public async Task Create_PriceOver1000_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Create(new Product 
            { 
                Id = 0, 
                Name = "Expensive Product", 
                Stock = 5, 
                Price = 1500 
            });

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var error = badRequest.Value;
            Assert.NotNull(error);
        }

        [Fact]
        public async Task Create_ValidPrice_ReturnsOk()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Create(new Product 
            { 
                Id = 0, 
                Name = "Valid Product", 
                Stock = 20, 
                Price = 99.99m 
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var product = Assert.IsType<Product>(ok.Value);
            Assert.Equal(99.99m, product.Price);
        }

        [Fact]
        public async Task Create_PriceZero_ReturnsOk()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Create(new Product 
            { 
                Id = 0, 
                Name = "Free Product", 
                Stock = 50, 
                Price = 0 
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var product = Assert.IsType<Product>(ok.Value);
            Assert.Equal(0, product.Price);
        }

        [Fact]
        public async Task Create_PriceAt1000_ReturnsOk()
        {
            var repo = new FakeProductRepository();
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Create(new Product 
            { 
                Id = 0, 
                Name = "Max Price Product", 
                Stock = 10, 
                Price = 1000 
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var product = Assert.IsType<Product>(ok.Value);
            Assert.Equal(1000, product.Price);
        }

        [Fact]
        public async Task Update_NegativePrice_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository(new[] 
            { 
                new Product { Id = 100, Name = "Existing Product", Stock = 10, Price = 50 } 
            });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Update(new Product 
            { 
                Id = 100, 
                Name = "Updated Product", 
                Stock = 15, 
                Price = -10 
            });

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_PriceOver1000_ReturnsBadRequest()
        {
            var repo = new FakeProductRepository(new[] 
            { 
                new Product { Id = 101, Name = "Existing Product", Stock = 10, Price = 50 } 
            });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Update(new Product 
            { 
                Id = 101, 
                Name = "Updated Product", 
                Stock = 15, 
                Price = 2000 
            });

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Update_ValidPrice_ReturnsOk()
        {
            var repo = new FakeProductRepository(new[] 
            { 
                new Product { Id = 102, Name = "Existing Product", Stock = 10, Price = 50 } 
            });
            var logger = new Mock<ILogger<ProductController>>();
            var controller = new ProductController(repo, logger.Object);

            var result = await controller.Update(new Product 
            { 
                Id = 102, 
                Name = "Updated Product", 
                Stock = 15, 
                Price = 199.99m 
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var product = Assert.IsType<Product>(ok.Value);
            Assert.Equal(199.99m, product.Price);
        }
    }
}
