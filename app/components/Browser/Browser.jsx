// @flow
//
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressBar from 'components/AddressBar';
import TabBar from 'components/TabBar';
import Notifier from 'components/Notifier';
import TabContents from 'components/TabContents';
import initialAppState from 'reducers/initialAppState.json';
import styles from './browser.css';
import setupAuthHandling from 'extensions/safe/authIPCHandling';

const log = require( 'electron-log' );

export default class Browser extends Component
{
    static propTypes =
    {
        addTab : PropTypes.func.isRequired
    }


    static defaultProps =
    {
        address : initialAppState.address
    }


    //

    componentDidMount( )
    {
        const { addTab, closeTab, closeActiveTab, reopenTab, addNotification, clearNotification } = this.props;
        const addressBar = this.address.refs.addressBar;

        setupAuthHandling( addNotification, clearNotification );

        ipcRenderer.on( 'command', ( ...args ) =>
        {
            const event = args[0];
            const type = args[1];
            const { tabContents } = this;
            const activeTab = tabContents.getActiveTab();

            const extraArgs = args.slice( 2 );


            switch ( type )
            {
                // TODO: Should this actually be passed as an array of browser actions to be dealt with>?
                // TODO: to the store?
                // TODO: And then parsed/removed?
                case 'file:new-tab':
                {
                    addTab( { url: 'about:blank', isActiveTab: true } );
                    console.log( 'ADDING TABBB, addressbar in focus? ', addressBar );
                    addressBar.focus();
                    return;
                }
                case 'file:close-tab':
                {
                    console.log( 'closing tabbb' );
                    closeTab( { index: extraArgs[0] } );
                    // addressBar.focus();
                    return;
                }
                case 'file:close-active-tab':
                {
                    console.log( 'closing active tabbb' );
                    closeActiveTab( );
                    // addressBar.focus();
                    return;
                }
                // case 'file:reopen-tab':
                //     {
                //         // console.log( 'closing tabbb' )
                //         reopenTab();
                //         // addressBar.focus();
                //         return;
                //     }
                case 'file:focus-location':
                {
                    addressBar.focus();
                    return;
                }
                // case 'file:close-tab':         return pages.remove(page)
                // case 'file:reopen-closed-tab': return pages.reopenLastRemoved()
                // case 'edit:find':              return navbar.showInpageFind(page)
                case 'view:reload': return activeTab.reload();
                case 'view:hard-reload': return activeTab.reloadIgnoringCache();
                // case 'view:zoom-in':           return zoom.zoomIn(page)
                // case 'view:zoom-out':          return zoom.zoomOut(page)
                // case 'view:zoom-reset':        return zoom.zoomReset(page)
                case 'view:toggle-dev-tools': return ( activeTab.isDevToolsOpened() ) ? activeTab.closeDevTools() : activeTab.openDevTools();
                case 'history:back': return activeTab.goBack();
                case 'history:forward': return activeTab.goForward();
                // case 'window:toggle-safe-mode':  return pages.toggleSafe();
                // case 'window:disable-web-security':  return pages.toggleWebSecurity();
                // case 'window:next-tab':        return pages.changeActiveBy(1)
                // case 'window:prev-tab':        return pages.changeActiveBy(-1)
                // case 'set-tab':                return pages.changeActiveTo(arg1)
                // case 'load-pinned-tabs':       return pages.loadPinnedFromDB()
                // case 'perms:prompt':           return permsPrompt(arg1, arg2, arg3)
                default : console.log( 'unhandled command: ', type );
            }
        } );
    }

    render()
    {
        const {
            addTab,
            address,
            closeTab,
            tabs,
            setActiveTab,
            updateActiveTab,
            updateTab,
            updateAddress,
            activeTabBackwards,
            activeTabForwards,
            notifications,
            // addNotification
        } = this.props;

        // only show the first notification
        const notification = notifications[0];

        //TODO: Remove Address reducer and just go off of active tab
        const activeTabAddress = tabs.find( tab => tab.isActiveTab ).url;

        return (
            <div className={ styles.container }>
                <TabBar
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    updateAddress={ updateAddress }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    closeTab={ closeTab }
                    tabs={ tabs }
                />
                <AddressBar
                    address={ activeTabAddress }
                    updateAddress={ updateAddress }
                    updateActiveTab={ updateActiveTab }
                    activeTabBackwards={activeTabBackwards }
                    activeTabForwards={activeTabForwards }
                    ref={ ( c ) =>
                    {
                        this.address = c;
                    } }
                />
                <Notifier
                    notification={ notification }
                />
                <TabContents
                    updateActiveTab={ updateActiveTab }
                    updateTab={ updateTab }
                    updateAddress={ updateAddress }
                    setActiveTab={ setActiveTab }
                    addTab={ addTab }
                    tabs={ tabs }
                    ref={ ( c ) =>
                    {
                        this.tabContents = c;
                    } }
                />
            </div>
        );
    }
}
