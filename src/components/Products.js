import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm'
import { Link } from 'react-router-dom'
import Button from './Button'
import productService from '../services/products'


const contentStyle = {
  backgroundColor: 'white',
  color: '#800000',
  padding: 10,
  margin: 20,
  fontSize: 16
}

const Products = ({ user, products, updateProductHandler }) => {
  const deleteProduct = (id) => {
    productService.deleteProduct(id).then(
      returnedData => {
        console.log('the returned product is: ', returnedData)
        const updatedProducts = products.filter(product => product.id !== id)
        updateProductHandler(updatedProducts)
      }
    )
  }
  useEffect(() => {
    console.log(user.username)
    productService.getProductsByid({ username: user.username }).then(
      response => {
        updateProductHandler(response)
      }
    )
  }, [])


  return (
    <div style={contentStyle}>
      <h3> Display Existing Products </h3>
      <ul>
        {products.map(product =>
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
            <Button text="Delete" eventHandler={() => deleteProduct(product.id)} />
          </li>
        )}
      </ul>
      <ProductForm products={products} updateProductHandler={updateProductHandler} />
    </div>
  )
}

export default Products