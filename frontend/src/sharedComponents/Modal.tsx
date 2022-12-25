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
        fill: ${colors.supergreen.base};
        position: relative;
        right: -13px;
        top: -14px;

    &:hover {
        fill: ${colors.supergreen.darken};
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
                background: `linear-gradient(153deg, ${colors.banana.lightest} 0%, ${colors.banana.lighten} 100%)`,
            },
            content: {
                position: 'static',
                maxWidth: '80vw',
                minWidth: '500px',
                borderRadius: '0.7rem',
                borderWidth: '0',
                background: colors.green.lighten,
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
