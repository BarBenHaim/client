import { io } from 'socket.io-client'

let socket

export const connectSocket = (roomId, setRole, setUsersCount) => {
    if (!socket) {
        socket = io('http://localhost:5000')
    }

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id)
        socket.emit('joinRoom', roomId)
    })

    socket.on('assignRole', role => setRole(role))
    socket.on('updateUsersCount', count => setUsersCount(count))
    socket.on('mentorLeft', () => {
        alert('The mentor has left the room. Redirecting to the lobby.')
        window.location.href = '/'
    })

    socket.on('codeUpdate', updatedCode => {
        console.log('Real-time code update received:', updatedCode)
    })

    socket.on('executionResult', result => {
        console.log('Execution result received:', result)
    })

    socket.on('connect_error', error => {
        console.error('Socket connection error:', error)
    })

    socket.on('disconnect', () => {
        console.log('Socket disconnected')
    })
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
    socket.off('codeUpdate')
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
    socket.once('executionResult', result => callback(result))
}

export const isSocketInitialized = () => !!socket
