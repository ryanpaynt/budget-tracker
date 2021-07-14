let db;

const request = window.indexedDB.open('Budget-Tracker', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('newTrans', {autoIncrement: true});
};

request.onsuccess = (event) => {
    db = event.target.request;

    if(navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = (event) => {
    console.log(event.target.errorCode);
};

const saveRecords = (record) => {
    const trans = db.transaction(['newTrans'], 'readWrite');

    const objStore = trans.objectStore('newTrans');

    objStore.add(record);
}
