import axiosZoneminder from '@/services/axiosZoneminderConfig';
import store from '@/store';
/* import axios from 'axios' */

export default class ZoneminderService {
    async getMonitors() {
        try {
            const response = await axiosZoneminder.get('/monitors.json');
            console.log('monitors', response.data.monitors);
            return response.data.monitors;
        } catch (error) {
            console.error('Erro ao buscar monitores:', error);
            throw error;
        }
    }

    async getMonitor(id) {
        try {
            const response = await axiosZoneminder.get(`/monitors/${id}.json`);
            console.log('monitor', response.data);
            return response.data.monitor;
        } catch (error) {
            console.error(`Erro ao buscar monitor ${id}:`, error);
            throw error;
        }
    }

    async changeMonitorState(id, analysing, recording) {
        try {
            const response = await axiosZoneminder.post(`/monitors/${id}.json`, {
                Monitor: {
                    Analysing: analysing,
                    Recording: recording,
                },
            });
            console.log(`Estado do monitor ${id} alterado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao alterar estado do monitor ${id}:`, error);
            throw error;
        }
    }

    async getDaemonStatus(id) {
        try {
            const response = await axiosZoneminder.get(`/monitors/daemonStatus/id:${id}/daemon:zmc.json`);
            console.log(`Status do daemon do monitor ${id}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar status do daemon do monitor ${id}:`, error);
            throw error;
        }
    }

    async addMonitor(monitorData) {
        try {
            const response = await axiosZoneminder.post('/monitors.json', { Monitor: monitorData });
            console.log('Monitor adicionado', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar monitor:', error);
            throw error;
        }
    }

    async editMonitor(id, monitorData) {
        try {
            const response = await axiosZoneminder.put(`/monitors/${id}.json`, { Monitor: monitorData });
            console.log(`Monitor ${id} editado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao editar monitor ${id}:`, error);
            throw error;
        }
    }

    async deleteMonitor(id) {
        try {
            const response = await axiosZoneminder.delete(`/monitors/${id}.json`);
            console.log(`Monitor ${id} deletado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar monitor ${id}:`, error);
            throw error;
        }
    }

    async armMonitor(id) {
        try {
            const response = await axiosZoneminder.get(`/monitors/alarm/id:${id}/command:on.json`);
            console.log(`Monitor ${id} armado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao armar monitor ${id}:`, error);
            throw error;
        }
    }

    async disarmMonitor(id) {
        try {
            const response = await axiosZoneminder.get(`/monitors/alarm/id:${id}/command:off.json`);
            console.log(`Monitor ${id} desarmado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao desarmar monitor ${id}:`, error);
            throw error;
        }
    }

    async getAlarmStatus(id) {
        try {
            const response = await axiosZoneminder.get(`/monitors/alarm/id:${id}/command:status.json`);
            console.log(`Status do alarme do monitor ${id}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar status do alarme do monitor ${id}:`, error);
            throw error;
        }
    }

    async getEvents() {
        try {
            const response = await axiosZoneminder.get('/events.json');
            console.log('events', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            throw error;
        }
    }

    async getEvent(id) {
        try {
            const response = await axiosZoneminder.get(`/events/${id}.json`);
            console.log('event', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar evento ${id}:`, error);
            throw error;
        }
    }

    async editEvent(id, eventData) {
        try {
            const response = await axiosZoneminder.put(`/events/${id}.json`, { Event: eventData });
            console.log(`Evento ${id} editado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao editar evento ${id}:`, error);
            throw error;
        }
    }

    async deleteEvent(id) {
        try {
            const response = await axiosZoneminder.delete(`/events/${id}.json`);
            console.log(`Evento ${id} deletado`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar evento ${id}:`, error);
            throw error;
        }
    }

    async getEventsByMonitorId(monitorId, params, page = 1) {
        try {
            let url = `/events/index/MonitorId:${monitorId}`

            if (params.startDate) {
                url += `/StartTime >=:${params.startDate}`
            }
            if (params.endDate) {
                url += `/EndTime <=:${params.endDate}`
            }

            url += `:${page}.json`

            const response = await axiosZoneminder.get(url);
            console.log(`Eventos do monitor ${monitorId}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar eventos do monitor ${monitorId}:`, error);
            throw error;
        }
    }

    downloadEvent(eventId) {
        let zoneminderBaseUrl = import.meta.env.VITE_API_URL_LOCALNETWORK
        try {
            const url = `${zoneminderBaseUrl}/index.php?mode=mp4&view=view_video&eid=${eventId}&auth=${store.getters.getToken}`

            return url
            /*       const response = await axios.get(url, {
                      responseType: 'blob'
                  })
      
                  const blob = new Blob([response.data], { type: 'video/mp4' })
                  console.log(response.data)
                  const downloadUrl = window.URL.createObjectURL(blob)
      
      
                  const link = document.createElement('a')
                  link.href = downloadUrl
                  link.download = `evento-${eventId}.mp4`
                  link.click()
      
      
                  window.URL.revokeObjectURL(downloadUrl) */
        } catch (error) {
            console.error('Erro ao baixar evento:', error)
            throw error
        }
    }
}
