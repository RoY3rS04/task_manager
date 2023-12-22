import jwt from 'jsonwebtoken';

const generateJWT = (userId: number) => {

    const token = jwt.sign(
        { userId },
        <string>process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    )

    return token;
}

export {
    generateJWT
}