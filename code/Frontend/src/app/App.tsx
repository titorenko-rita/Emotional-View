import {Provider} from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom'

import {MantineProvider} from "@mantine/core"

import {AuthProvider} from "@/app/context/auth-provider/AuthProvider";
import {setupStore} from "@/app/redux";
import {AppRoutes} from "@/app/routes/AppRoutes";
import {theme} from "@/app/theme";


const store = setupStore()

const App = () => (
    <MantineProvider theme={theme}>
        <Provider store={store}>
            <Router>
                <AuthProvider>
                    <AppRoutes/>
                </AuthProvider>
            </Router>
        </Provider>
    </MantineProvider>
)

export default App;
