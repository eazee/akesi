const input_field_template = (field_type, body, field, options={}) => {
    options.classes = options.classes || 'input'
    let label_html = "<label for='" + field + "' class='label'>" + (options.label || field) + "</label>"
    let value = (body && field in body) ? (" value='" + body[field].replace(/'/g, "\\'") + "'") : ""
    let field_html = "<div class='control'><input type='" + 
        field_type + "' class='" + (options.classes || '') +
        "' name='" + field + "' id='" + field +
        "'" + value + "></div>"
    let pre_html  = (options.pre)  ? "<p class='help'>"+options.pre+"</p>" : ""
    let post_html = (options.post) ? "<p class='help'>"+options.post+"</p>" : ""
    return "<div class='field'>"+label_html+pre_html+field_html+post_html+"</div>"
}

export function input_email(body, field, options={}) {
    return input_field_template('email', body, field, options)
}

export function input_field(body, field, options={}) {
    return input_field_template('text', body, field, options)
}

export function input_password(body, field, options={}) {
    return input_field_template('password', body, field, options)
}

export function input_textarea(body, field, options={}) {
    let value = (body && field in body) ? body[field] : ""
    let textarea_html = "<textarea name='"+field+"' id='"+field+
        "' class='"+(options.classes || 'textarea')+"'>"+value+"</textarea>"
    return "<div class='field'><label for='"+field+"'>"+(options.label || field)+
        "</label><div class='control'>"+textarea_html+"</div></div>"
}