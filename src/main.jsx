import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FlagProvider from "@unleash/proxy-client-react";
import FeatureFlags from "./FeatureFlags.js";

const config = {
    url: 'http://localhost:4242/api/frontend', // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
    clientKey: 'default:development.6affb057bf9b5e190eebc2c65b51333b5ef6354d21af0300f52c5483', // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
    appName: 'unleash_flags_frontend', // The name of your application. It's only used for identifying your application
    refreshInterval: 60, // How often (in seconds) the client should poll the proxy for updates
    disableMetrics: true,
    bootstrap: [{name: FeatureFlags.RELEASE_TOGGLE, enabled: true},
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
