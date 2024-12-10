import store from "@/store"

export function generateConnKey() {
    // Gera um connkey aleatorio para um stream (é recomendado pela API)
    return Math.floor(Math.random() * 100000)
}

export function generateStreamUrl(monitorId) {
    const baseUri =
        '/cgi-bin/nph-zms?scale=100&width=500&height=600&mode=jpeg&maxfps=30&buffer=1000'

    return `${baseUri}&monitor=${monitorId}&token=${store.getters.getToken}&connkey=${generateConnKey()}`
}

export function generateEventStreamUrl(eventId) {
    // replay=none
    const baseUri = '/cgi-bin/nph-zms?mode=jpeg&frame=1&scale=0&rate=100&maxfps=30&source=event'
    return `${baseUri}&event=${eventId}&connkey=${generateConnKey()}&token=${store.getters.getToken}`
}

export function generateEventVideoStreamUrl(eventId) {
    const baseUri = `http://192.168.1.107:88/index.php?mode=mpeg&format=h264&eid=${eventId}&view=view_video&auth=39d47a3753c77b78599aa4a45a3f1499`;
    /* Verificar por que o token nao autentica em alguns usos, parece ser muito grande. */
    /* store.getters.getToken */
    /* http://192.168.1.107:88/index.php?mode=mpeg&format=h264&eid=27&view=view_video&auth=39d47a3753c77b78599aa4a45a3f1499 */
    return baseUri
}
