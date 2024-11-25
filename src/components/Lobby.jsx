import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCodeBlocks } from '../utils/api'

const Lobby = () => {
    const [codeBlocks, setCodeBlocks] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCodeBlocks()
            .then(data => setCodeBlocks(data))
            .catch(err => console.error(err))
    }, [])

    const handleSelect = id => {
        navigate(`/codeblock/${id}`)
    }

    return (
        <div className='lobby'>
            <h1>Choose Code Block</h1>
            <ul>
                {codeBlocks.map(block => (
                    <li key={block._id} onClick={() => handleSelect(block._id)}>
                        {block.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Lobby
