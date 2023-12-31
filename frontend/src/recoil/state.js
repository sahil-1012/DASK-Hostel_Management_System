import { atom } from "recoil";

export const hosteliteState = atom({
    key: 'hosteliteState',
    default: '',
});

export const isSnackbarOpenState = atom({
    key: 'isSnackbarOpenState',
    default: false,
});

export const snackbarMessageState = atom({
    key: 'snackbarMessageState',
    default: '',
});

export const snackbarTypeState = atom({
    key: 'snackbarTypeState',
    default: 'info',
});

export const loggedInState = atom({
    key: 'loggedInState',
    default: false,
});

export const sideDrawerState = atom({
    key: 'sideDrawerState',
    default: false,
});