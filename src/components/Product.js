import React from 'react'
import { useParams } from 'react-router-dom'

const padding = {
  padding: 20,
  margin: 20,
  color: 'black',
  fontSize: 20
}

const Product = ({ products }) => {
  const id = useParams().id
  const product = products.find(p => p.id === id)
  if (product) {
    return (
      <div style={padding}>
        {product.title} -- {product.category} -- {product.id}
          -- <strong>{product.available ? 'Available' : 'Sold-Out'}</strong>
      </div>
    )
  }
  return 'Not Found'
}

export default Product