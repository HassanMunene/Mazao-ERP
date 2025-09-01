import asyncHandler from 'express-async-handler';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.json({ message: 'Get all users (Admin)' });
});

const getUserById = asyncHandler(async (req, res) => {
    /* TODO */
});
const updateUser = asyncHandler(async (req, res) => {
    /* TODO */
});
const deleteUser = asyncHandler(async (req, res) => {
    /* TODO */
});
const getUserCount = asyncHandler(async (req, res) => {
    /* TODO */
});

export { getUsers, getUserById, updateUser, deleteUser, getUserCount };