import React from 'react';
import { useParams } from 'react-router-dom';
import { FarmerForm } from '@/components/dashboard/FarmerForm';

const EditFarmerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Invalid farmer ID</div>;
    }

    return <FarmerForm mode="edit" farmerId={id} />;
};

export default EditFarmerPage;