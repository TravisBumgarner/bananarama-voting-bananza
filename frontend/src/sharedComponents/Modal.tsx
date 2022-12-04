import styled from 'styled-components'
import ReactModal from 'react-modal'

import { colors } from 'theme'
import { Heading } from '.'

type ModalProps = {
    children: JSX.Element | JSX.Element[]
    showModal: boolean
    closeModal: () => void
    contentLabel: string
}

const HeaderWrapper = styled.div`
    display: flex;
    margin: 0.5rem;
    justify-content: space-between;
    svg {
        cursor: pointer;
        fill: ${colors.BRIGHT1.base};
        position: relative;
        right: -13px;
        top: -14px;

    &:hover {
        fill: ${colors.BRIGHT1.darken};
        }
    }
    `

const ModalWrapper = styled.div`
`

const Modal = ({
    children, showModal, closeModal, contentLabel,
}: ModalProps) => (
    <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel={contentLabel}
        style={{
            overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.DARK1.base
            },
            content: {
                borderColor: colors.BRIGHT1.base,
                backgroundColor: colors.BRIGHT3.darkest,
                position: 'static',
                maxWidth: '80vw',
                minWidth: '500px',
                borderRadius: '1rem'
            },
        }}
    >
        <ModalWrapper>
            <HeaderWrapper>
                <Heading.H1>{contentLabel}</Heading.H1>
            </HeaderWrapper>
            {children}
        </ModalWrapper>
    </ReactModal>
)

export default Modal
