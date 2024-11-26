import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ''

export const fetchCodeBlocks = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/codeblocks`)
    return response.data
}

export const fetchCodeBlock = async id => {
    const response = await axios.get(`${API_BASE_URL}/api/codeblocks/${id}`)
    return response.data
}
