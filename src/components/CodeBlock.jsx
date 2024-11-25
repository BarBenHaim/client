import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCodeBlock } from '../utils/api'
import { connectSocket, disconnectSocket, subscribeToChanges, emitCodeChange, executeCode } from '../utils/socket'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'

const CodeBlock = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [solution, setSolution] = useState('')
    const [role, setRole] = useState('student')
    const [usersCount, setUsersCount] = useState(0)
    const [output, setOutput] = useState('')

    // Fetch code block data and connect WebSocket on mount
    useEffect(() => {
        fetchCodeBlock(id).then(data => {
            setCode(data.initialCode)
            setSolution(data.solution)
            connectSocket(id, setRole, setUsersCount)
        })

        // Disconnect WebSocket and navigate back on unmount
        return () => {
            disconnectSocket()
            navigate('/')
        }
    }, [id, navigate])

    // Subscribe to real-time code updates
    useEffect(() => {
        connectSocket(id, setRole, setUsersCount)
        subscribeToChanges(setCode)
    }, [])

    // Handle code changes in the editor
    const handleCodeChange = useCallback(
        (editor, data, value) => {
            setCode(value)
            emitCodeChange(value) // Send updates to the server
        },
        [setCode]
    )

    // Execute code and display output
    const handleRunCode = () => {
        executeCode(code, result => {
            setOutput(result)
            console.log(result)
        })
    }

    return (
        <div className='code-block'>
            <h1>{role === 'mentor' ? 'Mentor View' : 'Student View'}</h1>
            <p>Users in room: {usersCount}</p>
            <CodeMirror
                value={code}
                options={{
                    mode: 'javascript',
                    theme: 'material',
                    lineNumbers: true,
                    readOnly: role === 'mentor',
                    extraKeys: {
                        'Ctrl-Space': 'autocomplete',
                    },
                }}
                onBeforeChange={handleCodeChange}
            />
            {code === solution && <div className='smiley'>😊</div>}

            {role !== 'mentor' && (
                <div className='console'>
                    <button onClick={handleRunCode}>Run Code</button>
                    <div className='output'>
                        <h3>Output:</h3>
                        <pre>{output || 'No output yet.'}</pre>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodeBlock
