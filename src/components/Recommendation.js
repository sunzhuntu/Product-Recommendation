import React, { useState, useEffect } from 'react'
import recommendationService from '../services/recommendation_service'

const contentStyle = {
  backgroundColor: 'white',
  color: '#800000',
  padding: 10,
  margin: 20,
  fontSize: 16
}


const Recommendation = ({ user }) => {
  const [mostpop_list, setMostpop_list] = useState([])
  const [userknn_list, setUserknn_list] = useState([])
  const [itemknn_list, setItemknn_list] = useState([])
  const [mf_list, setMf_list] = useState([])

  const username = { username: user.username }

  useEffect(() => {
    console.log('effect')
    recommendationService
      .getMostPop()
      .then(response => {
        setMostpop_list(response)
      })
    recommendationService
      .getUserKNN(username)
      .then(response => {
        setUserknn_list(response)
      })
    recommendationService
      .getItemKNN(username)
      .then(response => {
        setItemknn_list(response)
      })
    recommendationService
      .getMF(username)
      .then(response => {
        setMf_list(response)
      })
  }, [])

  //console.log(mf_list)
  return (
    <div style={contentStyle}>
      <h3> Recommendation </h3>
      <ul>
        <h4>Most Popular</h4>
        {mostpop_list.map((product, i) =>
          <li key={i}>
            {product}
          </li>
        )}
      </ul>
      <ul>
        <h4>UserKNN</h4>
        {userknn_list.map((product, i) =>
          <li key={i}>
            {product}
          </li>
        )}
      </ul>
      <ul>
        <h4>ItemKNN</h4>
        {itemknn_list.map((product, i) =>
          <li key={i}>
            {product}
          </li>
        )}
      </ul>
      <ul>
        <h4>Matrix Factorization</h4>
        {mf_list.map((product, i) =>
          <li key={i}>
            {product}
          </li>
        )}
      </ul>
    </div>
  )
}

export default Recommendation