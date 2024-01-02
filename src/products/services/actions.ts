import { type Products, productsApi } from "..";

interface GetProductsOptions {
    filterKey?: string;
}

export const getProducts = async ({filterKey}:GetProductsOptions):Promise<Products[]> => {
    
    const filterUrl = (filterKey ? `category=${filterKey}` : "");

    const {data} = await productsApi.get<Products[]>(`/products?${filterUrl}`);
    return data;
};

export const getProductById = async (id:number):Promise<Products> => {
    const {data} = await productsApi.get<Products>(`/products/${id}`);
    return data;
};

export interface ProductLike {
    id?:         number;
    title:       string;
    price:       number;
    description: string;
    category:    string;
    image:       string;
}

export const createProduct = async (product:ProductLike) => {
    const {data} = await productsApi.post<Products>(`/products`, product);
    return data;
};
