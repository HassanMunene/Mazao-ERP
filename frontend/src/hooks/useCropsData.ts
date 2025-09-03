import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface FarmerCropData {
    farmerId: string;
    farmerName: string;
    cropCount: number;
    location?: string;
}

export const useCropsData = () => {
    const [data, setData] = useState<FarmerCropData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCropsData();
    }, []);

    const fetchCropsData = async () => {
        try {
            setLoading(true);
            // You might need to create a specific endpoint for this data
            // For now, we'll use the existing crops endpoint and process the data
            const response = await api.get('/crops?limit=1000'); // Get all crops

            if (response.data.success) {
                const crops = response.data.data.crops;

                // Group crops by farmer and count
                const farmerCropMap = new Map();

                crops.forEach((crop: any) => {
                    const farmerId = crop.farmer.id;
                    const farmerName = crop.farmer.profile?.fullName || 'Unknown Farmer';
                    const location = crop.farmer.profile?.location;

                    if (farmerCropMap.has(farmerId)) {
                        farmerCropMap.get(farmerId).cropCount++;
                    } else {
                        farmerCropMap.set(farmerId, {
                            farmerId,
                            farmerName,
                            cropCount: 1,
                            location
                        });
                    }
                });

                const farmerCropData = Array.from(farmerCropMap.values());
                setData(farmerCropData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch crops data');
            console.error('Failed to fetch crops data:', err);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refetch: fetchCropsData };
};