import asyncHandler from 'express-async-handler';

const getCrops = asyncHandler(async (req, res) => {
    /* TODO: Get all crops for admin, user's crops for farmer */
    res.json({ message: 'Get crops' });
});

const getCropById = asyncHandler(async (req, res) => {
    /* TODO */
});
const createCrop = asyncHandler(async (req, res) => {
    /* TODO */
});
const updateCrop = asyncHandler(async (req, res) => {
    /* TODO */
});
const deleteCrop = asyncHandler(async (req, res) => {
    /* TODO */
});
const getCropStats = asyncHandler(async (req, res) => {
    /* TODO: Get stats for charts (crops per farmer, crops by type) */
});

export { getCrops, getCropById, createCrop, updateCrop, deleteCrop, getCropStats };