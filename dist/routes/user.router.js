"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post('/login', controllers_1.UsersController.loginUser);
exports.default = router;
//# sourceMappingURL=user.router.js.map