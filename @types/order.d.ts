declare type CreateOrderInput = {
  restaurantId: string
  items: [
    {
      name: string
      quantity: number
    }
  ]
}
