const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('email').isEmail().withMessage('Format email salah!'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter!'),
    body('phone')
        .matches(/^(08|628|\+628)[0-9]{8,11}$/)
        .withMessage('Nomor telepon tidak valid (Gunakan format 08/628)!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = { validateRegister };