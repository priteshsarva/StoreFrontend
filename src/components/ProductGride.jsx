import React from 'react'
import Card from './Card';

const ProductGride = ({ products }) => {


    return (
        <>
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {products.products.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No Products found</p>
                    ) : (
                        products.products.map((product) => (
                            <Card key={product.productId}
                                title={product.productName}
                                price={product.productOriginalPrice}
                                coverImg={product.featuredimg}
                                id={product.productId}
                                catName={product.catName}
                                sizeName={product.sizeName || "[]"}
                                primarycat={product.primarycat}
                            />

                        ))
                    )}
                </div>
            </div>

        </>
    )
}

export default ProductGride
