import * as notifications from 'actions/notification_actions';

describe( 'notification actions', () =>
{
    it( 'should have types', () =>
    {
        expect( notifications.TYPES ).toBeDefined();
    } );

    it( 'should add a notification', () =>
    {
        const payload = { text: 'hi' };
        const expectedAction = {
            type : notifications.TYPES.ADD_NOTIFICATION,
            payload
        };
        expect( notifications.addNotification( payload ) ).toEqual( expectedAction );
    } );

    it( 'should add a local notification', () =>
    {
        const payload = { text: 'hi' };
        const expectedAction = {
            type : notifications.TYPES.ADD_LOCAL_NOTIFICATION,
            payload,
            meta: { scope: 'local'}
        };
        expect( notifications.addLocalNotification( payload ) ).toEqual( expectedAction );
    } );

    it( 'should clear a notification', () =>
    {
        const expectedAction = {
            type : notifications.TYPES.CLEAR_NOTIFICATION,
            payload: {}
        };
        expect( notifications.clearNotification( ) ).toEqual( expectedAction );
    } );

} );
