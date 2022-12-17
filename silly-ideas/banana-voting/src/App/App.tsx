
import React from 'react'
import { render } from 'react-dom'
import { Container } from './Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  )
}

export default App
