import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCodeBlocks } from '../utils/api'
import { addImagesToCodeBlocks } from '../utils/imageUtils'

const Lobby = () => {
    const [codeBlocks, setCodeBlocks] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAndAddImages = async () => {
            try {
                const data = await fetchCodeBlocks()
                const dataWithImages = await addImagesToCodeBlocks(data)
                setCodeBlocks(dataWithImages)
            } catch (err) {
                console.error(err)
            }
        }

        fetchAndAddImages()
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
                        <img src={block.image} alt={`${block.title} thumbnail`} />
                        <div className='content'>
                            <h2>{block.title}</h2>
                            <p>Click to explore the code block.</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Lobby
