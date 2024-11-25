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
        subscribeToChanges(setCode)
    }, [])

    const handleCodeChange = useCallback(
        (editor, data, value) => {
            setCode(value)
            emitCodeChange(value)
        },
        [setCode]
    )

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
