const DB_NAME = 'productdb'
const STORAGE_NAME = 'products'
const DB_VERSION = 1
let DB

export default class DBController{
    async getDb(){
        return new Promise((resolve, reject) => {
            if(DB) return resolve(DB)
            const request = window.indexedDB.open(DB_NAME, DB_VERSION)
            request.onerror = e => {
                console.log('Error opening db', e)
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('Error')
            }
            request.onsuccess = e => {
                DB = e.target.result
                resolve(DB)
            }
            request.onupgradeneeded = e => {
                let db = e.target.result
                db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' })
            }
        })
    }
    async removeItem(product){
        const db = await this.getDb()
        return new Promise(resolve => {
            const trans = db.transaction([STORAGE_NAME], 'readwrite')
            trans.oncomplete = () => {
                resolve()
            }
            const store = trans.objectStore(STORAGE_NAME)
            store.delete(product.id)
        })
    }
    async getAll(){
        let db = await this.getDb()
        return new Promise(resolve => {
            let trans = db.transaction([STORAGE_NAME], 'readonly')
            trans.oncomplete = () => {
                resolve(products)
            }
            const store = trans.objectStore(STORAGE_NAME)
            const products = []
            store.openCursor().onsuccess = e => {
                const cursor = e.target.result
                if (cursor) {
                    products.push(cursor.value)
                    cursor.continue()
                }
            }
        })
    }
    async addItem(item){
        console.log('i', item)
        let db = await this.getDb()
        let tx = db.transaction(['products'], 'readwrite');
        let store = tx.objectStore('products');
        store.add(item);
        tx.oncomplete = () => {
            console.log('stored note!')
        }
        tx.onerror = (event) => {
            console.log('error storing note ', event.target.errorCode);
        }
    }
}