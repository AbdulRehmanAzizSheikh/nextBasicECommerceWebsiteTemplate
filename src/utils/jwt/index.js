import jsonwebtoken from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export const generateToken = (data, expiresInSeconds) => {
    if (expiresInSeconds) {
        return jsonwebtoken.sign(data, secret, { expiresIn: expiresInSeconds });
    }
    return jsonwebtoken.sign(data, secret);
};

export const decodeToken = (token) => {
    return jsonwebtoken.verify(token, secret);
};