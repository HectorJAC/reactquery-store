import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Products, productActions } from "..";

export const useProductMutation = () => {
    
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: productActions.createProduct,

        onMutate: (product) => {
            console.log('Mutando - Optimistic update');

            // Optimistic update
            const optimisticProduct = {id: Math.random(), ...product};

            // Almacenar el producto en el cache del queryClient
            queryClient.setQueryData<Products[]>(
                ["products", {filterKey: product.category}],
                (oldData) => {
                    if (!oldData) {
                        return [optimisticProduct];
                    }
                    return [...oldData, optimisticProduct];
                }
            );

            return {optimisticProduct};
        },

        onSuccess: (product, _variables, context) => {
            // queryClient.invalidateQueries({
            //     queryKey: ["products", {filterKey: data.category}],
            // });

            queryClient.removeQueries({
                queryKey: ["products", context?.optimisticProduct.id],
            });

            queryClient.setQueryData<Products[]>(
                ["products", {filterKey: product.category}],
                (oldData) => {
                    if (!oldData) {
                        return [product];
                    }

                    return oldData.map((cacheProduct) => {
                        return cacheProduct.id === context?.optimisticProduct.id ? product : cacheProduct;
                    })
                }
            );
        },

        onError: (_error, variables, context) => {
            queryClient.removeQueries({
                queryKey: ["products", context?.optimisticProduct.id],
            });

            queryClient.setQueryData<Products[]>(
                ["products", {filterKey: variables.category}],
                (oldData) => {
                    if (!oldData) {
                        return [];
                    }

                    return oldData.filter((cacheProduct) => {
                        return cacheProduct.id !== context?.optimisticProduct.id;
                    })
                }
            );
        }
    });

    return mutation;
};