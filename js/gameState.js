const gameState = {
    currentPhase: 0,

    justice: 50,
    wisdom: 50,
    courage: 50,
    temperance: 50,
    resources: 50,
    stability: 50,

    choices: [],

    cityStructure: {
        producers: null,
        guardians: null,
        rulers: null
    },

    completedPhases: []
};
function resetGameState() {
    gameState.currentPhase = 0;

    gameState.justice = 50;
    gameState.wisdom = 50;
    gameState.courage = 50;
    gameState.temperance = 50;
    gameState.resources = 50;
    gameState.stability = 50;

    gameState.choices = [];

    gameState.cityStructure = {
        producers: null,
        guardians: null,
        rulers: null
    };

    gameState.completedPhases = [];
}