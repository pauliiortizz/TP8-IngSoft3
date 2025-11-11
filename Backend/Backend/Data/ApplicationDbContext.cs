using Microsoft.EntityFrameworkCore;
using ProductCrudApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductCrudApi.Data
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<ProductCrudApi.Models.Product> Products { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
