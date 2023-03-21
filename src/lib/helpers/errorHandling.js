export function validateField (data, field, type, errors) {
    if (!data[field] || typeof data[field] !== type) {
        errors.push({ field: field, message: `${field} should exist and have a ${type} value` })
    }
}
  
export function handleErrors (errors) {
    return new Response(
    JSON.stringify({
        errors: errors,
    }),
    {status: 400}
    )
}