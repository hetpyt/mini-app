import { isFunction } from "@vkontakte/vkjs";
import ky from 'ky';

function dataSourceFactory(prefixUrl, searchParams) {
    return class DataSource {
        constructor(uri, params, onUpdate) {
            this.uri = uri;
            this.params = params;
            this.onUpdate = onUpdate;
        }
    
        /**
         * @param {any} val
         */
        set uri(val) {
            this._uri = val;
        }
    
        get uri() {
            return this._uri;
        }
    
        /**
         * @param {any} val
         */
        set params(val) {
            this._params = val;
        }
    
        get params() {
            return this._params;
        }
    
         /**
         * @param {(...args: any[]) => any} val
         */
         set onUpdate(val) {
            if (isFunction(val)) this._onUpdate = val;
        }
        
        get onUpdate() {
            return isFunction(this._onUpdate) ? this._onUpdate : (() => {});
        }

        get error() {
            return this._error;
        }

        get data() {
            return this._data;
        }

        setResult(data) {
            if (isObject(data)) {
                if (data.hasOwnProperty('error')) {
                    this._error = data.error;
                } else if (result.hasOwnProperty('result')){
                    this._data = data.result;
                } else {
                    this._error = {message : "Получен неожиданный ответ от сервера: не содержит ожидаемый атрибут [1]"};
                }
            }
        }

        async update() {
            this._error = null;
            this._result = null;

            let options = {
                prefixUrl: prefixUrl,
                mode: 'no-cors',
                throwHttpErrors : false,
                searchParams: searchParams,
            };
            if (this.params) {
                options.method = 'post';
                options.json = this.params;
            }
            try {
                this.setResult(await ky(this.uri, options).json());
    
            } catch (e) {
                this._error = {
                    message : e.message,
                }
    
            } finally {
                this.onUpdate(this);
            }
    
        }
    }
}

export default dataSourceFactory;