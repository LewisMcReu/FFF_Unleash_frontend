import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FlagProvider from "@unleash/proxy-client-react";
import FeatureFlags from "./FeatureFlags.js";

const config = {
    url: import.meta.env.VITE_UNLEASH, // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
    clientKey: import.meta.env.VITE_UNLEASH_KEY, // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
    appName: 'unleash_flags_frontend', // The name of your application. It's only used for identifying your application
    disableMetrics: false,
    bootstrap: [{name: FeatureFlags.RELEASE_TOGGLE, enabled: false},
        {name: FeatureFlags.UPDATE_FLAG, enabled: true},
        {name: FeatureFlags.NASA, enabled: true},
        {name: FeatureFlags.SAVE_FLAG, enabled: true},
        {name: FeatureFlags.COLOUR_PICKER, enabled: true},
        {name: FeatureFlags.CHARGE, enabled: true},
        {name: FeatureFlags.LIKE_FLAG, enabled: true}]
};

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <FlagProvider config={config}>
        <div className="container-fluid">
            <App/>
        </div>
    </FlagProvider>
</React.StrictMode>,)
