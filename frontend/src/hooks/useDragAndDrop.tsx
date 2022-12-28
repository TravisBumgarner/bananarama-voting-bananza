import { createContext, useContext, useMemo, useState } from 'react'

// Could be extended to support multiple things being dragged and dropped.
// This could be done by chaging the shape of draggedItemIndex to be Record<string, number>
// Where the key defines a unique pairing of dragged item and hovered item (such as banana and bin).

const votingContext = createContext(
    {
    } as {
        draggedItem: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
        hoveredBin: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
        matchedBin: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
        matchedItem: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
    },
)

const VotingContext = ({ children }: { children: React.ReactChild }) => {
    const [matchedBinIndex, setMatchedBinIndex] = useState<number | null>(null)
    const [matchedItemIndex, setMatchedItemIndex] = useState<number | null>(null)
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const [hoveredBinIndex, setHoveredBinIndex] = useState<number | null>(null)

    const store = useMemo(() => ({
        draggedItem: [draggedItemIndex, setDraggedItemIndex] as const,
        hoveredBin: [hoveredBinIndex, setHoveredBinIndex] as const,
        matchedBin: [matchedBinIndex, setMatchedBinIndex] as const,
        matchedItem: [matchedItemIndex, setMatchedItemIndex] as const,
    }), [draggedItemIndex, hoveredBinIndex, matchedBinIndex, matchedItemIndex])
    return <votingContext.Provider value={store}>{children}</votingContext.Provider>
}

const useDragAndDrop = () => {
    const {
        draggedItem: [draggedItemIndex, setDraggedItemIndex],
        hoveredBin: [hoveredBinIndex, setHoveredBinIndex],
        matchedBin: [matchedBinIndex, setMatchedBinIndex],
        matchedItem: [matchedItemIndex, setMatchedItemIndex],
    } = useContext(votingContext)

    const dragStartCallback = (index: number) => {
        setMatchedBinIndex(null)
        setMatchedItemIndex(null)

        setDraggedItemIndex(index)
    }

    const dragEnterCallback = (index: number) => {
        setHoveredBinIndex(index)
    }

    const dragLeaveCallback = () => {
        setHoveredBinIndex(null)
    }

    const dropCallback = () => {
        setMatchedBinIndex(hoveredBinIndex)
        setMatchedItemIndex(draggedItemIndex)

        setDraggedItemIndex(null)
        setHoveredBinIndex(null)
    }

    // Could the function to make bins and items be put here.
    return {
        dragEnterCallback,
        dragStartCallback,
        matchedItemIndex,
        matchedBinIndex,
        dropCallback,
        dragLeaveCallback,
        hoveredBinIndex,
        draggedItemIndex
    }
}

export default useDragAndDrop
export { VotingContext }
