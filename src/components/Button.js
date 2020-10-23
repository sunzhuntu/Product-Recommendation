import React from 'react'

const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: 4,
    margin: 4,
    fontSize: 16,
    cursor: 'pointer',
    fontStyle: 'italic',
    borderRadius: 12
}

const Button = ({ eventHandler, text }) => {
    return <button style={buttonStyle} onClick={eventHandler}> {text} </button>
}

export default Button