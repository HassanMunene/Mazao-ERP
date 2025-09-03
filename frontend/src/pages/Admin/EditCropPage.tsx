import React from 'react';
import { useParams } from 'react-router-dom';
import { CropForm } from '@/components/dashboard/crops/CropForm';

const EditCropPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Invalid crop ID</div>;
    }

    return <CropForm mode="edit" cropId={id} />;
};

export default EditCropPage;