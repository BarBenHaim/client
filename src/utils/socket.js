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

    socket.on('assignRole', role => {
        console.log('Role assigned:', role)
        setRole(role)
    })

    socket.on('updateUsersCount', count => {
        console.log('Users count updated:', count)
        setUsersCount(count)
    })

    socket.on('mentorLeft', () => {
        console.log('Mentor left the room. Redirecting to lobby...')
        alert('The mentor has left the room. Redirecting to the lobby.')
        window.location.href = '/'
    })

    socket.on('codeUpdate', updatedCode => {
        console.log('Real-time code update received:', updatedCode)
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
        console.log('Disconnecting from socket...')
        socket.disconnect()
        socket = null
    }
}

export const subscribeToChanges = callback => {
    console.log(socket)
    if (!socket) {
        console.error('Socket not initialized. Cannot subscribe to changes.')
        return
    }
    socket.off('codeUpdate') // Remove any previous listeners to avoid duplicates
    socket.on('codeUpdate', updatedCode => {
        console.log('Real-time code update received:', updatedCode)
        callback(updatedCode) // Trigger callback with the updated code
    })
}

export const emitCodeChange = code => {
    if (!socket) {
        console.error('Socket not initialized. Cannot emit code change.')
        return
    }
    console.log('Emitting code change:', code)
    socket.emit('codeChange', code) // Emit code change to server
}

export const isSocketInitialized = () => {
    return !!socket
}
