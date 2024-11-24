import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lobby from './components/Lobby/Lobby'
import CodeBlock from './components/CodeBlock/CodeBlock'
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Lobby />} />
                <Route path='/codeblock/:id' element={<CodeBlock />} />
            </Routes>
        </Router>
    )
}

export default App
