// Main Game Shared Routes
router.post('/generate', gameController.generateQuestion(type, difficulty));