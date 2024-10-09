"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (email === data_1.MOCK_EMAIL && password === data_1.MOCK_PASSWORD) {
        res.status(200).json();
        return;
    }
    res.status(401).json('User does not exist');
};
exports.default = { loginUser };
//# sourceMappingURL=user.controller.js.map