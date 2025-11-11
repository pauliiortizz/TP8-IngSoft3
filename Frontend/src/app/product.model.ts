export class Product {
  public stock: number = 0;
  public price: number = 0;

  constructor(
    public id: number,
    public name: string,
    public createdDate?: string,
    stock: number = 0,
    price: number = 0
  ) {
    this.stock = stock;
    this.price = price;
  }
}
