class State {
    constructor(stateName, comesFrom) {
        this.stateName = stateName;
        this.comesFrom = comesFrom;
        this.goesTo = null;
    }
    
    goAway(goesTo) {
        this.goesTo = goesTo;
    }
}

class FSM {
    constructor(config) {
        if (!config) {
            throw new Error('Не задана начальная конфигурация');
        }
        this.config = config;
        this.allStates = Object.keys(config.states);
        this.currentStates = [new State(this.config.initial, null)];
        this.currentIndex = 0;
    }

    getState() {
        return this.currentStates[this.currentIndex].stateName;
    }

    changeState(state) {
        if (!this.allStates.includes(state)) {
            throw new Error(`Состояния '${state}' нет в словаре FSM.`);
        }
        const newState = new State(state, this.currentStates[this.currentIndex]);
        this.currentStates[this.currentIndex].goAway(newState);
        this.currentStates.push(newState);
        this.currentIndex += 1;
    }

    trigger(event) {
        const currentState = this.currentStates[this.currentIndex];
        const currentStateName = currentState.stateName;
        const currentStateConfig = this.config.states[currentStateName].transitions;
        const currentStateDictionary = Object.keys(currentStateConfig);

        if (!currentStateDictionary.includes(event)) {
            throw new Error(`У состояния '${currentStateName}' нет правила перехода '${event}'.`);
        }
        const newStateName = currentStateConfig[event];
        const newState = new State(newStateName, currentState);
        currentState.goAway(newState);
        this.currentStates.push(newState);
        this.currentIndex += 1;
    }

    reset() {
        this.currentStates = [new State(this.config.initial, null)];
        this.currentIndex = 0;
    }

    getStates(event) {
        if (!event) {
            return this.allStates;
        }
        return this.allStates.filter(el => {
            const dict = Object.keys(this.config.states[el].transitions);
            return dict.includes(event);
        });
    }

    undo() {
        const currentState = this.currentStates[this.currentIndex];
        if (!currentState.comesFrom) {
            return false;
        }
        this.currentIndex -= 1;
        return true;
    }

    redo() {
        if (!this.currentStates[this.currentIndex].goesTo) {
            return false;
        }
        this.currentIndex += 1;
        return true;
    }

    clearHistory() {
        const currentStateName = this.currentStates[this.currentIndex].stateName;
        this.currentStates = [new State(currentStateName, null)];
        this.currentIndex = 0;
    }
}

module.exports = FSM;
