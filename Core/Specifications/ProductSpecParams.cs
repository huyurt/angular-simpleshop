using System;
using System.Linq;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1;

        private int _pageSize = 6;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public int? BrandId { get; set; }
        public string BrandIdsStr { get; set; }

        public int[] BrandIds
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(BrandIdsStr))
                    return BrandIdsStr.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                return new int[0];
            }
        }

        public int? TypeId { get; set; }
        public string TypeIdsStr { get; set; }

        public int[] TypeIds
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(TypeIdsStr))
                    return TypeIdsStr.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                return new int[0];
            }
        }

        public string Sort { get; set; }
        private string _search;

        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
    }
}