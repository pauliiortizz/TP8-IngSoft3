using EmployeeCrudApi.Controllers;
using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace EmployeeCrudApi.Tests
{
    public class EmployeeControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Crear una nueva base de datos en memoria para cada prueba
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfEmployees()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Products.AddRange(
                new Product { Id = 1, Name = "John DOE" },
                new Product { Id = 2, Name = "Jane DOE" }
            );
            context.SaveChanges();

            var controller = new ProductController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("John DOE", result[0].Name);
            Assert.Equal("Jane DOE", result[1].Name);
        }

        [Fact]
        public async Task GetById_ReturnsEmployeeById()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Products.Add(new Product { Id = 1, Name = "John DOE" });
            context.SaveChanges();

            var controller = new ProductController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("John DOE", result.Name);
        }

        [Fact]
        public async Task Create_AddsEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new ProductController(context);

            var newProduct = new Product { Id = 3, Name = "New Product" };

            // Act
            var createResult = await controller.Create(newProduct);

            // Assert
            var product = await context.Products.FindAsync(3);
            Assert.NotNull(product);
            // The controller formats names; ensure it's set (case-insensitive check)
            Assert.Equal("New PRODUCT", product.Name);
        }

        [Fact]
        public async Task Update_UpdatesEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var existingProduct = new Product { Id = 1, Name = "Old NAME" };
            context.Products.Add(existingProduct);
            context.SaveChanges();
            var controller = new ProductController(context);

            var updatedProduct = new Product { Id = 1, Name = "Updated Name" };

            // Act
            await controller.Update(updatedProduct);

            // Assert
            var product = await context.Products.FindAsync(1);
            Assert.NotNull(product);
            Assert.Equal("Updated NAME", product.Name);
        }

        [Fact]
        public async Task Delete_RemovesEmployee()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var productToDelete = new Product { Id = 1, Name = "John Doe" };
            context.Products.Add(productToDelete);
            context.SaveChanges();
            var controller = new ProductController(context);

            // Act
            await controller.Delete(1);

            // Assert
            var product = await context.Products.FindAsync(1);
            Assert.Null(product); // Verifica que el producto fue eliminado
        }

        [Fact]
        public async Task Create_Rejects_DuplicateName()
        {
            var context = GetInMemoryDbContext();
            context.Products.Add(new Product { Id = 1, Name = "Existing User" });
            context.SaveChanges();
            var controller = new EmployeeCrudApi.Controllers.ProductController(context);
            var newProduct = new Product { Id = 2, Name = "existing user" }; // different case

            var result = await controller.Create(newProduct);

            Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_Formats_Name_As_GivenAndUppercaseSurname()
        {
            var context = GetInMemoryDbContext();
            var controller = new EmployeeCrudApi.Controllers.ProductController(context);

            var newProduct = new Product { Id = 5, Name = "juan carlos chamizo" };
            var result = await controller.Create(newProduct);

            Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var stored = await context.Products.FindAsync(5);
            Assert.Equal("Juan Carlos CHAMIZO", stored.Name);
        }

        [Fact]
        public async Task Create_Rejects_Names_With_Digits()
        {
            var context = GetInMemoryDbContext();
            var controller = new EmployeeCrudApi.Controllers.ProductController(context);

            var newProduct = new Product { Id = 6, Name = "John D0e" };
            var result = await controller.Create(newProduct);

            Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_Rejects_Excessive_Repeats()
        {
            var context = GetInMemoryDbContext();
            var controller = new EmployeeCrudApi.Controllers.ProductController(context);

            var newProduct = new Product { Id = 7, Name = "Juuuuaannnn Perez" };
            var result = await controller.Create(newProduct);

            Assert.IsType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>(result);
        }
    }
}
