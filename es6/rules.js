class Rule {
    error(field) {
        return this.message.replace(':field:', field);
    }
}

class Required extends Rule {
    constructor() {
        super();

        this.rule = 'required';

        this.message = ':field: field is required.';
    }

    valid(value) {
        return value !== undefined && value !== null && value !== '';
    }
}

class Numeric extends Rule {
    constructor() {
        super();

        this.rule = 'numeric';

        this.message = ':field: field must be numeric.';
    }

    valid(value) {
        return value === undefined || value === null || (value !== true && !isNaN(value));
    }
}

class Min extends Rule {
    constructor(min) {
        super();

        this.rule = 'min';
        this.min = min;

        this.message = ':field: field must be greater or equal to :min:.';
    }

    valid(value) {
        return value === null || value === undefined || value === '' || value >= this.min;
    }

    error(field) {
        return this.message
            .replace(':field:', field)
            .replace(':min:', this.min);
    }
}

export {Required, Numeric, Min};
