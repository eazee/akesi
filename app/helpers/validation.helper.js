import Validator from 'validatorjs'

export default function validate(req, rules) {
    let validation = new Validator(req.body, rules)
    if(validation.passes()) return true
    let validation_errors = validation.errors.all()
    Object.keys(validation_errors).forEach(x => req.flash('error', validation_errors[x]))
    return false
}