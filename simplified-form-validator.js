var SimplifiedFormValidator = (function () {
    'use strict';

    var Rule = function () {

    };
    Rule.prototype.error = function (field) {
        return this.message.replace(':field:', field);
    };

    var Required = function () {
        this.rule = 'required';

        this.message = ':field: field is required.';
    };
    Required.prototype = Object.create(Rule.prototype);
    Required.prototype.valid = function (value) {
        return value !== undefined && value !== null && value !== '';
    };

    var Numeric = function () {
        this.rule = 'numeric';

        this.message = ':field: field must be numeric.';
    };
    Numeric.prototype = Object.create(Rule.prototype);
    Numeric.prototype.valid = function (value) {
        return value === undefined || value === null || (value !== true && !isNaN(value));
    };

    var Min = function (min) {
        this.rule = 'min';
        this.min = min;

        this.message = ':field: field must be greater or equal to :min:.';
    };
    Min.prototype = Object.create(Rule.prototype);
    Min.prototype.valid = function (value) {
        return value === null || value === undefined || value === '' || value >= this.min;
    };
    Min.prototype.error = function (field) {
        return this.message
            .replace(':field:', field)
            .replace(':min:', this.min);
    };

    /**
     * The validation engine.
     * @param object form
     * @param object rules
     * @param object messages Custom messages for failed rules.
     */
    var Validator = function (form, rules, messages) {
        this.form = form;
        this.rules = rules;
        this.messages = messages;

        this.failed = null;
        this.errors = {};
    };
    Validator.prototype.fails = function () {
        var parseRules = function (rules) {
            rules = rules.split('|');

            return rules.map(function (rule) {
                var args;

                if (rule.indexOf(':') !== -1) {
                    args = rule.split(':');
                    rule = args.shift();
                }

                switch (rule) {
                    case 'required':
                        return new Required();
                    case 'numeric':
                        return new Numeric();
                    case 'min':
                        return new Min(args[0]);
                    default:
                        throw 'There is no implemented rule ' + rule + '.';
                }
            });
        };

        /**
         * The core of validation.
         * @return void
         */
        var validate = function () {
            this.failed = false;

            for (var key in this.rules) {
                if (!this.rules.hasOwnProperty(key)) {
                    continue;
                }

                parseRules(this.rules[key]).forEach(function (validator) {
                    if (validator.valid(this.form[key])) {
                        return;
                    }

                    this.failed = true;

                    if (this.messages[key + '.' + validator.rule]) {
                        this.errors[key] = this.messages[key + '.' + validator.rule];

                        return;
                    }

                    this.errors[key] = validator.error(key);
                }.bind(this));
            }
        }.bind(this);

        if (this.failed === null) {
            validate();
        }

        return this.failed;
    };

    return Validator;
}());
