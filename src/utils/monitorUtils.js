import store from "@/store"

export function generateConnKey() {
    // Gera um connkey aleatorio para um stream (é recomendado pela API)
    return Math.floor(Math.random() * 100000)
}

export function generateStreamUrl(monitorId) {
    const baseUri =
        '/cgi-bin/nph-zms?scale=100&width=500&height=600&mode=jpeg&maxfps=5&buffer=1000'

    return `${baseUri}&monitor=${monitorId}&token=${store.getters.getToken}&connkey=${generateConnKey()}`
}

export function generateEventStreamUrl(monitorId, eventId) {
    return
}
