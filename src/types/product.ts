

export interface IProduct {
    id: number,
    title: string,
    category: string,
    description: string,
    price: number,
    image: string,
    rating: {
        count: number,
        rate: number,
    }
}