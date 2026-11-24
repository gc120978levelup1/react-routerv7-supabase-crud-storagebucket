
import { type RefObject } from 'react';
                     
// used for subscribing
const get_store_value = (key: string) => {
    return JSON.parse(localStorage.getItem(key)!)
}

const set_store_value = (key: string, value: Object) => {
    localStorage.setItem(key, JSON.stringify(value, null, 2))
}

const store_subscribe_fast = (callbackFunction: CallableFunction) => {
    return setInterval(() => {
        callbackFunction();
    }, 1000);
}

const store_subscribe_slow = (callbackFunction: CallableFunction) => {
    return setInterval(() => {
        callbackFunction();
    }, 60000);
}

const store_broadcast_fast = (callbackFunction: CallableFunction) => {
    return setInterval(() => {
        callbackFunction();
    }, 1000);
}


const store_broadcast_slow = (callbackFunction: CallableFunction) => {
    return setInterval(() => {
        callbackFunction();
    }, 60000);
}

const store_clean_up = (
    store_subscription_id: RefObject<ReturnType<typeof setInterval> | null>
) => {
    if (store_subscription_id.current) {
        clearInterval(store_subscription_id.current);
        store_subscription_id.current = null;
    }
};

const store_clean_up_key = (store_key: string) => {
    localStorage.removeItem(store_key)
}

export {get_store_value, set_store_value, store_subscribe_fast, store_subscribe_slow, store_broadcast_fast, store_broadcast_slow, store_clean_up, store_clean_up_key }

const userDutyStatus = "userDutyStatus1234567890";
const store_key_user_id = "store_key_user_id90485-093iorgknfmuwei";
const store_key_avatar = "store_key_avatar9iewogkgplke[msgperrgp";
const user_settings = "userSettings1234567890";

export { 
    userDutyStatus,
    store_key_user_id, 
    store_key_avatar, 
    user_settings, 
}

