#SimplifiedFormValidator

This is a simple validator that can validate form data against
Laravel-like rules.

For now only 3 rules has been implemented:
- required (The field under validation must be present in the input data and not empty);
- numeric (The field under validation must be numeric);
- min:value (The field under validation must have a minimum value);

The more rules can be added by simply adding new Rule-like object and tangible case for it.
