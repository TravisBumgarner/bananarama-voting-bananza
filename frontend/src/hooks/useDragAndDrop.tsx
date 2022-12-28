import { createContext, useContext, useMemo, useState } from 'react'

// Could be extended to support multiple things being dragged and dropped.
// This could be done by chaging the shape of draggedItemIndex to be Record<string, number>
// Where the key defines a unique pairing of dragged item and hovered item (such as banana and bin).

const votingContext = createContext(
    {
    } as {
        draggedItem: readonly [number, React.Dispatch<React.SetStateAction<number>>]
        hoveredBin: readonly [number, React.Dispatch<React.SetStateAction<number>>]
        matchedBin: readonly [number, React.Dispatch<React.SetStateAction<number>>]
        matchedItem: readonly [number, React.Dispatch<React.SetStateAction<number>>]
    },
)

const VotingContext = ({ children }: { children: React.ReactChild }) => {
    const [matchedBinIndex, setMatchedBinIndex] = useState<number>(-1)
    const [matchedItemIndex, setMatchedItemIndex] = useState<number>(-1)

    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1)
    const [hoveredBinIndex, setHoveredItemIndex] = useState<number>(-1)

    const store = useMemo(() => ({
        draggedItem: [draggedItemIndex, setDraggedItemIndex] as const,
        hoveredBin: [hoveredBinIndex, setHoveredItemIndex] as const,
        matchedBin: [matchedBinIndex, setMatchedBinIndex] as const,
        matchedItem: [matchedItemIndex, setMatchedItemIndex] as const,
    }), [draggedItemIndex, hoveredBinIndex, matchedBinIndex, matchedItemIndex])
    return <votingContext.Provider value={store}>{children}</votingContext.Provider>
}

const useDragAndDrop = () => {
    const {
        draggedItem: [draggedItemIndex, setDraggedItemIndex],
        hoveredBin: [hoveredBinIndex, setHoveredItemIndex],
        matchedBin: [matchedBinIndex, setMatchedBinIndex],
        matchedItem: [matchedItemIndex, setMatchedItemIndex],
    } = useContext(votingContext)

    const dragStartCallback = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setMatchedBinIndex(-1)
        setMatchedItemIndex(-1)

        setDraggedItemIndex(index)
    }

    const dragEnterCallback = (e: React.DragEvent<HTMLElement>, index: number) => {
        setHoveredItemIndex(index)
    }

    const dropCallback = () => {
        setMatchedBinIndex(hoveredBinIndex)
        setMatchedItemIndex(draggedItemIndex)

        setDraggedItemIndex(-1)
        setHoveredItemIndex(-1)
    }

    // Could the function to make bins and items be put here.
    return {
        dragEnterCallback,
        dragStartCallback,
        matchedItemIndex,
        matchedBinIndex,
        dropCallback
    }
}

export default useDragAndDrop
export { VotingContext }
