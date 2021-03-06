import path from 'path';

import { app } from 'electron';
import pkg from 'appPackage';

export const isRunningUnpacked = !!process.execPath.match( /[\\/]electron/ );
export const isRunningPackaged = !isRunningUnpacked;
export const env = process.env.NODE_ENV || 'production';
export const isHot = process.env.HOT || 0;

// TODO: For live-prod we need to setup menu/devtools etc, while ensuring it doesnt affect e2e tests
export const isRunningProduction = /^prod/.test( env );
export const isRunningDevelopment = /^dev/.test( env );

export const isRunningSpectronTest = !!process.env.IS_SPECTRON;

export const inRendererProcess = typeof window !== 'undefined';

// Set global for tab preload.
// Adds app folder for asar packaging (space before app is important).
const preloadLocation = isRunningUnpacked ? '' : '../';
global.preloadFile = path.resolve( __dirname, preloadLocation, 'webPreload.js' );

let safeNodeAppPathModifier = '';

if ( isRunningPackaged )
{
    safeNodeAppPathModifier = '../app.asar.unpacked/';
}

export const PROTOCOLS = {
    SAFE           : 'safe',
    SAFE_AUTH      : 'safe-auth',
    SAFE_LOGS      : 'safe-logs',
    INTERNAL_PAGES : 'peruse'
};

export const INTERNAL_PAGES = {
    HISTORY   : 'history',
    BOOKMARKS : 'bookmarks'
};

export const CONFIG = {
    PORT           : 3984,
    SAFE_PARTITION : 'persist:safe-tab',
    LIB_PATH       : path.resolve( __dirname, safeNodeAppPathModifier, 'node_modules/@maidsafe/safe-node-app/src/native' ),
    CONFIG_PATH    : path.resolve( __dirname, '../resources' )
};

export const LIB_PATH = {
    SAFE_AUTH : {
        win32  : './safe_authenticator.dll',
        darwin : './libsafe_authenticator.dylib',
        linux  : './libsafe_authenticator.so'
    },
    SYSTEM_URI : {
        win32  : './system_uri.dll',
        darwin : './libsystem_uri.dylib',
        linux  : './libsystem_uri.so'
    }
};

// HACK: Prevent jest dying due to no electron globals
const execPath = ( ) =>
{
    if ( env === 'test' || inRendererProcess )
    {
        return '';
    }

    return isRunningUnpacked ? [ process.execPath, app.getAppPath() ] : [ app.getPath( 'exe' ) ];
};

const appInfo = {
    info : {
        id             : pkg.identifier,
        scope          : null,
        name           : pkg.productName,
        vendor         : pkg.author.name,
        customExecPath : execPath()
    },
    opt : {
        own_container : false,
    },
    permissions : {
        _public : [
            'Read',
            'Insert',
            'Update',
            'Delete',
        ],
        _publicNames : [
            'Read',
            'Insert',
            'Update',
            'Delete',
        ],
    },
};

// OSX: Add bundle for electron in dev mode
if ( isRunningUnpacked && process.platform === 'darwin' )
{
    appInfo.info.bundle = 'com.github.electron';
}
else if ( process.platform === 'darwin' )
{
    appInfo.info.bundle = 'com.electron.peruse';
}

export const APP_INFO = appInfo;

export const SAFE = {
    APP_STATUS : {
        AUTHORISED           : 'AUTHORISED',
        AUTHORISING          : 'AUTHORISING',
        AUTHORISATION_FAILED : 'AUTHORISATION_FAILED',
        AUTHORISATION_DENIED : 'AUTHORISATION_DENIED',
    },
    ACCESS_CONTAINERS : {
        PUBLIC       : '_public',
        PUBLIC_NAMES : '_publicNames',
    },
    NETWORK_STATE : {
        INIT         : 'Init',
        CONNECTED    : 'Connected',
        UNKNOWN      : 'Unknown',
        DISCONNECTED : 'Disconnected',
    },
    SAFE_APP_ERROR_CODES : {
        ERR_AUTH_DENIED : -200,
    }
};


export const CLASSES = {
    ACTIVE_TAB : 'js-tabBar__active-tab',
    TAB        : 'js-tab',
    ADD_TAB    : 'js-tabBar__add-tab',
    CLOSE_TAB  : 'js-tabBar__close-tab',
    PERUSE_PAGE : 'js-peruse__page'
};
