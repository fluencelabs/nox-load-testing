export const retry = (fn, maxAttempts) => {
    const execute = (attempt) => {
        try {
            return fn()
        } catch (err) {
            if (attempt <= maxAttempts) {
                const nextAttempt = attempt + 1
                console.error(`Retrying due to:`, err)
                return execute(nextAttempt)
            } else {
                throw err
            }
        }
    }
    return execute(1)
}
