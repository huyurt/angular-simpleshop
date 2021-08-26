using System.Linq;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithFiltersForCountSpecification : BaseSpecifcation<Product>
    {
        public ProductsWithFiltersForCountSpecification(ProductSpecParams productParams) : base(x =>
            (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
            (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
            (!(productParams.BrandIds.Length > 0) || productParams.BrandIds.Contains(x.ProductBrandId)) &&
            (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId) &&
            (!(productParams.TypeIds.Length > 0) || productParams.TypeIds.Contains(x.ProductTypeId))
        )
        {

        }

    }
}
