import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCodeBlock } from '../../utils/api'
import { connectSocket, disconnectSocket, subscribeToChanges, emitCodeChange } from '../../utils/socket'
import './CodeBlock.css'

const CodeBlock = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [solution, setSolution] = useState('')
    const [role, setRole] = useState('student')
    const [usersCount, setUsersCount] = useState(0)

    useEffect(() => {
        fetchCodeBlock(id).then(data => {
            setCode(data.initialCode)
            setSolution(data.solution)
            connectSocket(id, setRole, setUsersCount)
        })

        return () => {
            disconnectSocket()
            navigate('/')
        }
    }, [id, navigate])

    useEffect(() => {
        connectSocket(id, setRole, setUsersCount)
        subscribeToChanges(newCode => setCode(newCode))
    }, [])

    const handleCodeChange = e => {
        const newCode = e.target.value
        setCode(newCode)
        emitCodeChange(newCode)
    }

    return (
        <div className='code-block'>
            <h1>{role === 'mentor' ? 'Mentor View' : 'Student View'}</h1>
            <p>Users in room: {usersCount}</p>
            {role === 'mentor' ? (
                <textarea value={code} readOnly />
            ) : (
                <textarea value={code} onChange={handleCodeChange} />
            )}
            {code === solution && <div className='smiley'>😊</div>}
        </div>
    )
}

export default CodeBlock
