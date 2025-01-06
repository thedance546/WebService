// src/features/MyIngredients/AddIngredientOptionModal.tsx

import React from 'react';
import Modal from '../../components/molecules/Modal';
import Button from '../../components/atoms/Button';
import Grid from '../../components/atoms/Grid';

interface AddIngredientOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    openReceiptInputModal: () => void;
    openManualInputModal: () => void;
}

const IngredientOptionsModal: React.FC<AddIngredientOptionsModalProps> = ({
    isOpen,
    onClose,
    openManualInputModal,
    openReceiptInputModal,
}) => {
    if (!isOpen) return null;

    const options = [
        {
            label: '영수증 입력',
            icon: '🧾',
            action: () => {
                openReceiptInputModal();
                onClose();
            },
        },
        {
            label: '직접 입력',
            icon: '✍️',
            action: () => {
                openManualInputModal();
                onClose();
            },
        },
    ];

    return (
        <Modal title="식재료 추가 방법 선택" onClose={onClose}>
            <Grid columns={2} columnsMd={2} margin="0 1rem" className="gap-4">
                {options.map((option, index) => (
                    <div key={index} className="col d-flex justify-content-center">
                        <Button
                            onClick={option.action}
                            className="d-flex flex-column align-items-center justify-content-center p-3"
                            variant="light"
                        >
                            <div className="mb-2">{option.icon}</div>
                            <div>{option.label}</div>
                        </Button>
                    </div>
                ))}
            </Grid>
        </Modal>
    );
};

export default IngredientOptionsModal;
