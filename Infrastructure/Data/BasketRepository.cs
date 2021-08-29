using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly StoreContext _context;

        public BasketRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            var customerBasket = await _context.CustomerBaskets.Include(b => b.Items).FirstOrDefaultAsync(b => b.Id == basketId);
            if (customerBasket == null)
                return true;
            _context.RemoveRange(customerBasket.Items);
            _context.Remove(customerBasket);
            return await _context.SaveChangesAsync() > 1;
        }

        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var customerBasket = await _context.CustomerBaskets.Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.Id == basketId);
            return customerBasket;
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var customerBasket = await _context.CustomerBaskets.Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.Id == basket.Id);
            if (customerBasket == null)
            {
                _context.CustomerBaskets.Add(basket);
            }
            else
            {
                foreach (var basketItem in basket.Items)
                {
                    var updated = false;
                    foreach (var customerBasketItem in customerBasket.Items)
                    {
                        if (basketItem.Id == customerBasketItem.Id)
                        {
                            customerBasketItem.Quantity = basketItem.Quantity;
                            updated = true;
                            break;
                        }
                    }

                    if (!updated)
                    {
                        _context.Entry(basketItem).State = EntityState.Added;
                        customerBasket.Items.Add(basketItem);
                    }
                }

                var ids = customerBasket.Items?.Select(b => b.Id)?.ToList() ?? new List<int>();
                foreach (var id in ids)
                {
                    if (!basket.Items.Any(b => b.Id == id))
                    {
                        customerBasket.Items?.RemoveAll(b => b.Id == id);
                    }
                }

                customerBasket.ClientSecret = basket.ClientSecret;
                customerBasket.ShippingPrice = basket.ShippingPrice;
                customerBasket.DeliveryMethodId = basket.DeliveryMethodId;
                customerBasket.PaymentIntentId = basket.PaymentIntentId;
            }

            await _context.SaveChangesAsync();

            return await GetBasketAsync(basket.Id);
        }
    }
}