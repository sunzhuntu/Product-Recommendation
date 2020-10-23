import axios from 'axios'
const baseUrl = '/api/users'

let token = null 

const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addUser = async (newUser) => {
    // const config = {
    //   headers: { Authorization: token },
    // }
    const response = await axios.post(baseUrl, newUser)
    return response.data
}

const updateProduct = (id, changedProduct) => {
    const request = axios.put(`${baseUrl}/${id}`, changedProduct)
    return request.then(response => response.data)
}

const deleteProduct = async (id) => {
    const response =  await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

export default {getAll, addUser, updateProduct, deleteProduct, setToken}