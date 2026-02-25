import { all } from 'redux-saga/effects';
import { userSaga } from '../services/saga-actions';

export function* rootSaga() {
    yield all([
        userSaga(),
        // more sagas
    ]);
}
