let db;

const request = window.indexedDB.open('Budget-Tracker', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('pending-transactions', {autoIncrement: true});
};

request.onsuccess = (event) => {
    db = event.target.request;

    if(navigator.onLine) {
        checkDb();
    }
};

request.onerror = (event) => {
    console.log(event.target.errorCode);
};

const saveRecords = (record) => {
    const trans = db.transaction(['pending-transactions'], 'readWrite');

    const objStore = trans.objectStore('pending-transactions');

    objStore.add(record);
}

const checkDb = () => {
    const trans = db.transaction(['pending-transactions'], 'readWrite');

    const objStore = trans.objectStore('pending-transactions');
    
    const all = objStore.getAll();

    all.onsuccess = () => {
        if (all.result.length > 0){
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(all.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }

                const trans = db.transaction(['pending-transactions'], 'readWrite');

                const objStore = trans.objectStore('pending-transactions');

                objStore.clear();

                alert('All saved transactions have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}

window.addEventListener("online", checkDb);