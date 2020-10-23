import axios from 'axios'


const baseUrl = '/api/Recommendation'

const getMostPop = async () => {
    const url = baseUrl + '/MostPop'
    const request = axios.get(url)
    const response = await request
    return response.data
}
const getItemKNN = async (username) => {
    const url = baseUrl + '/ItemKNN'
    const response = await axios.post(url, username)
    return response.data
}
const getUserKNN = async (username) => {
    const url = baseUrl + '/UserKNN'
    const response = await axios.post(url, username)
    return response.data
}
const getMF = async (username) => {
    const url = baseUrl + '/MF'
    const response = await axios.post(url, username)
    return response.data
}

export default { getMostPop, getItemKNN, getUserKNN, getMF }