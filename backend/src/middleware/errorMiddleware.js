export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Prisma specific error handling
    if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Resource not found';
    } else if (err.code === 'P2002') {
        statusCode = 400;
        message = 'A unique field constraint was violated';
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? 'ErrorStack' : err.stack,
    });
};
