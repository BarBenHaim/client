import { io } from 'socket.io-client'

let socket

export const connectSocket = (roomId, setRole, setUsersCount) => {
    if (!socket) {
        // const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
        socket = io('http://localhost:5000')

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id)
            socket.emit('joinRoom', roomId)
        })

        socket.on('assignRole', setRole)
        socket.on('updateUsersCount', setUsersCount)
        socket.on('mentorLeft', () => {
            alert('The mentor has left the room. Redirecting to the lobby.')
            window.location.href = '/'
        })

        socket.on('connect_error', error => {
            console.error('Socket connection error:', error)
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
        })
    }
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

export const subscribeToChanges = callback => {
    if (!socket) {
        console.error('Socket not initialized. Cannot subscribe to changes.')
        return
    }
    socket.on('codeUpdate', updatedCode => callback(updatedCode))
}

export const emitCodeChange = code => {
    if (!socket) {
        console.error('Socket not initialized. Cannot emit code change.')
        return
    }
    socket.emit('codeChange', code)
}

export const executeCode = (code, callback) => {
    if (!socket) return
    socket.emit('executeCode', code)
    socket.once('executionResult', callback)
}

export const isSocketInitialized = () => !!socket
