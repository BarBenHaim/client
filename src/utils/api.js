import axios from 'axios'

export const fetchCodeBlocks = async () => {
    const response = await axios.get('/api/codeblocks')
    return response.data
}

export const fetchCodeBlock = async id => {
    const response = await axios.get(`/api/codeblocks/${id}`)
    return response.data
}
