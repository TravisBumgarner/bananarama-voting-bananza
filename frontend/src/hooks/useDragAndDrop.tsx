import { createContext, useContext, useMemo, useRef, useState } from 'react'

// Could be extended to support multiple things being dragged and dropped.
// This could be done by chaging the shape of draggedItemIndex to be Record<string, number>
// Where the key defines a unique pairing of dragged item and hovered item (such as banana and bin).

const votingContext = createContext(
    {
    } as {
        draggedItem: React.MutableRefObject<number | null>
        hoveredBin: React.MutableRefObject<number | null>
        matchedBin: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
        matchedItem: readonly [number | null, React.Dispatch<React.SetStateAction<number | null>>]
    },
)

const VotingContext = ({ children }: { children: React.ReactChild }) => {
    const [matchedBinIndex, setMatchedBinIndex] = useState<number | null>(null)
    const [matchedItemIndex, setMatchedItemIndex] = useState<number | null>(null)

    const draggedItemIndex = useRef<number | null>(null)
    const hoveredBinIndex = useRef<number | null>(null)

    const store = useMemo(() => ({
        draggedItem: draggedItemIndex,
        hoveredBin: hoveredBinIndex,
        matchedBin: [matchedBinIndex, setMatchedBinIndex] as const,
        matchedItem: [matchedItemIndex, setMatchedItemIndex] as const,
    }), [draggedItemIndex, hoveredBinIndex, matchedBinIndex, matchedItemIndex])
    return <votingContext.Provider value={store}>{children}</votingContext.Provider>
}

const useDragAndDrop = () => {
    const {
        draggedItem,
        hoveredBin,
        matchedBin: [matchedBinIndex, setMatchedBinIndex],
        matchedItem: [matchedItemIndex, setMatchedItemIndex],
    } = useContext(votingContext)

    const dragStartCallback = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setMatchedBinIndex(null)
        setMatchedItemIndex(null)

        draggedItem.current = index
    }

    const dragEnterCallback = (e: React.DragEvent<HTMLElement>, index: number) => {
        hoveredBin.current = index
    }

    const dropCallback = () => {
        setMatchedBinIndex(hoveredBin.current)
        setMatchedItemIndex(draggedItem.current)

        hoveredBin.current = null
        draggedItem.current = null
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
