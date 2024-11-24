import { io } from 'socket.io-client'

let socket

/**
 * @param {string} roomId - The room ID to join
 * @param {function} setRole - Function to set the user role (mentor/student)
 * @param {function} setUsersCount - Function to update the user count in the room
 */
export const connectSocket = (roomId, setRole, setUsersCount) => {
    socket = io('http://localhost:5000')

    socket.emit('joinRoom', roomId)

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

    socket.on('connect_error', error => {
        console.error('Socket connection error:', error)
    })
}

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting from socket...')
        socket.disconnect()
    }
}

/**
 * @param {function} callback - Function to execute when code is updated
 */
export const subscribeToChanges = callback => {
    if (!socket) return
    socket.off('codeUpdate')
    socket.on('codeUpdate', updatedCode => {
        console.log('Real-time code update received:', updatedCode)
        callback(updatedCode)
    })
}

/**
 * @param {string} code - The updated code
 */
export const emitCodeChange = code => {
    if (!socket) return
    console.log('Emitting code change:', code)
    socket.emit('codeChange', code)
}
