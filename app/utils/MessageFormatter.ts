
export function formatMessage(message: string, author: string) {
    return(`${author} said: ${message}\n`)
}

export function formatReplyMessage(message: string, author: string, replyTo: string, replyToAuthor: string) {
    return(`${author} replied to ${replyToAuthor}'s message "${replyTo.substring(0, 100)}..." with : ${message}\n`)
}