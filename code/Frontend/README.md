## Команды для запуска
`npm run dev` - дев билд 


## Настройки сети
Настройки лежат в файле 

### `src/app/redux/api/endpoints.ts`

```ts
export const API_BASE_URL = '/api'
```
Здесь я задал фейковый BASE_URL, чтоб потом его заменять в проксе, чтоб убрать ошибку CORS


### `vite.config.ts`

```ts
server: {
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
        },
    }
}
```
Тут я как раз все запросы, где есть /api меняю на 'http://127.0.0.1:8000', т.е. на сервак напрямую
