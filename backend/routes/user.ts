// -------------- Unprotected Routes --------------
router.post("/register", userController.registerUser);

router.post('/login', userController.loginUser);

// -------------- Protected Routes -----------------
router.post('/logout', authMiddleware, userController.logoutUser);
router.get('/me', authMiddleware, userController.getUserProfile);
router.delete('/me', authMiddleware, userController.deleteUserAccount);