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

const checkDb = () => {
    const trans = db.transaction(['newTrans'], 'readWrite');

    const objStore = trans.objectStore('newTrans');
    
    const all = objStore.getAll();

getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your pending db
        const transaction = db.transaction(["pending"], "readwrite");

        // access your pending object store
        const store = transaction.objectStore("pending");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
