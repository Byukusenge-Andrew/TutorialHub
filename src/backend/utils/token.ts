import jwt from 'jsonwebtoken';

export const generateToken = (user: { _id?: unknown; id?: unknown }) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
}; 