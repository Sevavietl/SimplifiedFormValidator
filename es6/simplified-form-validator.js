import {Required, Numeric, Min} from './rules';

/**
 * This is a simple validator that can validate form against
 * Laravel like rules.
 *
 * For now only 3 rules has been implemented:
 * - required (The field under validation must be present in the input data and not empty);
 * - numeric (The field under validation must be numeric);
 * - min:value (The field under validation must have a minimum value);
 *
 * The more rules can be added by simply adding new Rule-like object and tangible case for it.
 */
export default class SimplifiedFormValidator {
    constructor (form, rules, messages) {
        this.form = form;
        this.rules = rules;
        this.messages = messages;

        this.failed = null;
        this.errors = {};
    }

    fails() {
        var parseRules = (rules) => {
            rules = rules.split('|');

            return rules.map((rule) => {
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

        var validate = () => {
            this.failed = false;

            for (var key in this.rules) {
                if (!this.rules.hasOwnProperty(key)) {
                    continue;
                }

                parseRules(this.rules[key]).forEach((validator) => {
                    if (validator.valid(this.form[key])) {
                        return;
                    }

                    this.failed = true;

                    if (this.messages[key + '.' + validator.rule]) {
                        this.errors[key] = this.messages[key + '.' + validator.rule];

                        return;
                    }

                    this.errors[key] = validator.error(key);
                });
            }
        };

        if (this.failed === null) {
            validate();
        }

        return this.failed;
    }
}
