import React, { useState } from 'react'
import productService from '../services/products'

const ProductForm = ({ products, updateProductHandler }) => {
  const [newProductTitle, setNewProductTitle] = useState('a new product title')
  const [newProductCategory, setNewProductCategory] = useState('a new product category')

  const addProduct = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const productObject = {
      title: newProductTitle,
      category: newProductCategory,
      available: Math.random() > 0.5
    }

    productService
      .createProduct(productObject)
      .then(returnedProduct => {
        console.log(returnedProduct)
        const updatedProducts = products.concat(returnedProduct)
        updateProductHandler(updatedProducts)
        setNewProductTitle('a new product name')
        setNewProductCategory('a new product category')
      })
  }

  return (
    <div>
      <h3> Add New Products </h3>
      <form onSubmit={addProduct}>
        <input
          value={newProductTitle}
          onChange={(event) => setNewProductTitle(event.target.value)}
        />
        <input
          value={newProductCategory}
          onChange={(event) => setNewProductCategory(event.target.value)}
        />
        <button type="submit"> Save </button>
      </form>
    </div>
  )
}

export default ProductForm