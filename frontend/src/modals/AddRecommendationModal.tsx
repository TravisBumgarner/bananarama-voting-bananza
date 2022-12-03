import { FormEvent, useCallback, useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import Autocomplete from 'react-google-autocomplete'

import { Heading, Button, LabelAndInput, Paragraph, ButtonWrapper } from 'sharedComponents'
import { TRecommendation } from 'types'
import { context } from 'context'
import { colors } from 'theme'
import { logger } from 'utilities'

const ADD_RECOMMENDATION = gql`
    mutation AddRecommendation (
        $notes: String!
        $latitude: Float!
        $longitude: Float!
        $location: String!
        $hasVisited: Boolean!
        $recommender: String!
    ) {
        addRecommendation(
            notes: $notes,
            latitude: $latitude,
            longitude: $longitude,
            location: $location,
            hasVisited: $hasVisited,
            recommender: $recommender
        ){
        id
        }
    }
`
type RecommendationModalProps = {
    closeModal: () => void
}

const RecommendationModal = ({ closeModal }: RecommendationModalProps) => {
    const [addRecommendation] = useMutation<{ addRecommendation: TRecommendation }>(ADD_RECOMMENDATION)

    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [location, setLocation] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const [recommender, setRecommender] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEditingLocation, setIsEditingLocation] = useState<boolean>(true)

    const { dispatch } = useContext(context)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (location.length === 0 || latitude === null || longitude === null) {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Please select a location from the dropdown', timeToLiveMS: 5000 } })
            return
        }

        setIsLoading(true)
        const newRecommendation: Omit<TRecommendation, 'id'> = {
            notes,
            location,
            latitude,
            longitude,
            recommender,
            hasVisited: false
        }

        try {
            const response = await addRecommendation({
                variables: newRecommendation,
            })
            if (!response.data || response.data.addRecommendation === null) {
                dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to submit recommendation', timeToLiveMS: 5000 } })
            } else {
                dispatch({ type: 'ADD_MESSAGE', data: { message: 'Submitted!', timeToLiveMS: 3000 } })
            }
        } catch (error) {
            logger(error.message)
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to submit recommendation', timeToLiveMS: 5000 } })
        } finally {
            setIsLoading(false)
            closeModal()
        }
    }

    const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
        // The values on place need to match the Autocomplete's options' fields.
        setLatitude(place!.geometry!.location.lat())
        setLongitude(place!.geometry!.location.lng())
        setLocation(place!.formatted_address || '')
    }, [])

    const handlePlaceChanged = useCallback(() => {
        // Clear location data if user doesn't pick a place.
        setLatitude(null)
        setLongitude(null)
        setLocation('')
    }, [])

    const handleLocationEditClick = useCallback(() => setIsEditingLocation((prev) => !prev), [])

    return (
        <div>
            <div>
                <Heading.H2>New Recommendation</Heading.H2>
                <form onSubmit={handleSubmit}>
                    {!isEditingLocation
                        ? (
                            <Paragraph>
                                <span>{location}(lat: {latitude}, long: {longitude})</span>
                                <Button onClick={handleLocationEditClick} variation="primary">Edit</Button>
                            </Paragraph>
                        )
                        : (
                            <Autocomplete
                                disabled={isLoading}
                                style={{
                                    fontFamily: "'Special Elite', cursive",
                                    fontSize: '1rem',
                                    border: '2px solid',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    fontWeight: '700',
                                    color: colors.PRIMARY.base,
                                    borderColor: colors.PRIMARY.base,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    clipPath: 'polygon(3% 0, 7% 1%, 11% 0%, 16% 2%, 20% 0, 23% 2%, 28% 2%, 32% 1%, 35% 1%, 39% 3%, 41% 1%, 45% 0%, 47% 2%, 50% 2%, 53% 0, 58% 2%, 60% 2%, 63% 1%, 65% 0%, 67% 2%, 69% 2%, 73% 1%, 76% 1%, 79% 0, 82% 1%, 85% 0, 87% 1%, 89% 0, 92% 1%, 96% 0, 98% 3%, 99% 3%, 99% 6%, 100% 11%, 98% 15%, 100% 21%, 99% 28%, 100% 32%, 99% 35%, 99% 40%, 100% 43%, 99% 48%, 100% 53%, 100% 57%, 99% 60%, 100% 64%, 100% 68%, 99% 72%, 100% 75%, 100% 79%, 99% 83%, 100% 86%, 100% 90%, 99% 94%, 99% 98%, 95% 99%, 92% 99%, 89% 100%, 86% 99%, 83% 100%, 77% 99%, 72% 100%, 66% 98%, 62% 100%, 59% 99%, 54% 99%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 38% 100%, 35% 99%, 31% 100%, 28% 99%, 25% 99%, 22% 100%, 19% 99%, 16% 100%, 13% 99%, 10% 99%, 7% 100%, 4% 99%, 2% 97%, 1% 97%, 0% 94%, 1% 89%, 0% 84%, 1% 81%, 0 76%, 0 71%, 1% 66%, 0% 64%, 0% 61%, 0% 59%, 1% 54%, 0% 49%, 1% 45%, 0% 40%, 1% 37%, 0% 34%, 1% 29%, 0% 23%, 2% 20%, 1% 17%, 1% 13%, 0 10%, 1% 6%, 1% 3%)'
                                }}
                                onChange={handlePlaceChanged}
                                onPlaceSelected={handlePlaceSelected}
                                options={{
                                    types: ['(regions)'],
                                    fields: ['geometry.location', 'formatted_address'],
                                }}
                            />
                        )}
                    <LabelAndInput
                        disabled={isLoading}
                        name="recommender"
                        label="Recommender"
                        value={recommender}
                        handleChange={setRecommender}
                    />
                    <LabelAndInput
                        disabled={isLoading}
                        name="notes"
                        label="Notes"
                        value={notes}
                        handleChange={setNotes}
                        type="textarea"
                    />

                    <ButtonWrapper
                        right={[
                            <Button key="cancel" onClick={closeModal} disabled={isLoading} variation="warning">Cancel</Button>,
                            <Button key="submit" type="submit" disabled={isLoading} variation="primary">Submit</Button>
                        ]}
                    />
                </form>
            </div>
        </div>
    )
}

export default RecommendationModal
