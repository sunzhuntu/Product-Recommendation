import React from 'react'
import userService from '../services/users'
import Recommendation from './Recommendation'

const contentStyle = {
    backgroundColor: 'white',
    color: '#800000',
    padding: 10,
    margin: 20,
    fontSize: 16
}


const Users = ({user}) => {
  return(
    <div style={contentStyle}>
      <h3> Users </h3>
      <Recommendation user={user}> </Recommendation>
    </div>
  )
}
export default Users