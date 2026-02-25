import { http, HttpResponse } from 'msw'
import { initInventoryItems } from './data';

export const handlers = [
    http.get('*/inventory/items', () => {
        return HttpResponse.json(initInventoryItems)
    })
]