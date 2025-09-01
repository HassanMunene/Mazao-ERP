import asyncHandler from 'express-async-handler';

const getMyProfile = asyncHandler(async (req, res) => {
    /* TODO: Get the full profile of the logged-in user */
    res.json({ message: 'Get my profile' });
});

const updateMyProfile = asyncHandler(async (req, res) => {
    /* TODO */
});

export { getMyProfile, updateMyProfile };