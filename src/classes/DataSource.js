import { isArray, isFunction, isObject, isUndefined } from "@vkontakte/vkjs";
import ky from 'ky';

function dataSourceFactory(prefixUrl, searchParams, beforeUpdate, afterUpdate) {
    return class DataSource {
        constructor(uri, paramsMap) {
            this.uri = uri;
            this.paramsMap = paramsMap;
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
         * @param {{ filtersMap: any[]; }} val
         */
        set paramsMap(val) {
            if (isObject(val)) {
                if (val.filtersMap && isArray(val.filtersMap)) {
                    this._filtersMap = val.filtersMap.map(f => (
                        {
                            field : f.field,
                            name : f.name ? f.name : f.field,
                            caption : f.caption,
                            type : f.type,
                            enum : f.type !== "enum" ? undefined : f.enum.map(e => (
                                {
                                    name : e.name ? e.name : String(e.value).toLowerCase(),
                                    value : e.value,
                                    caption : e.caption,
                                }    
                            )),
                            defaultValue : this._deepCopy(f.defaultValue),
                        }
                    ))
                }
                if (val.orderMap && isArray(val.orderMap)) {
                    this._orderMap = val.orderMap.map(e => (
                        {
                            field : e.field,
                            caption : e.caption,
                        }
                    ))
                }
            }
        }

        /**
         * @param {any} val
         */
        set params(val) {
            if (isObject(val)) {
                if (val.filters && isArray(val.filters)) {
                    this._filters = this._deepCopy(val.filters);
                }
                if (val.limits && isObject(val.limits)) {
                    this._limits = this._deepCopy(val.limits);
                }
                if (val.order) {
                    this._order = this._deepCopy(val.order);
                }
            }
        }
    
        get params() {
            let res = {}
            if (this._filters) {
                res.filters = this._deepCopy(this._filters);
            }
            if (this._limits) {
                res.limits = this._deepCopy(this._limits);
            }
            if (this._order) {
                res.order = this._deepCopy(this._order);
            }
            return res;
        }
    
        /**
         * @param {any[]} val
         */
        set filters(val) {
            if (isArray(val))
                this._filters = this._deepCopy(val);
        }

        get filters() {
            return this._deepCopy(this._filters);
        }

        /**
         * @param {any} val
         */
        set limits(val) {
            if (isObject(val)) {
                this._limits = this._deepCopy(val);
            }
        }

        get limits() {
            return this._deepCopy(this._limits);
        }

        /**
         * @param {any} val
         */
        set order(val) {
            this._order = this._deepCopy(val);
        }

        get order() {
            return this._deepCopy(this._order);
        }

        get error() {
            return this._error;
        }

        get totalDataLen() {
            return this._totalDataLen;
        }

        set data(val) {
            this._totalDataLen = undefined;
            if (isObject(val)) {
                if (val.hasOwnProperty("data")) {
                    this._data = val.data;
                } else {
                    this._data = val;
                }
                if (val.hasOwnProperty("total_count")) {
                    this._totalDataLen = parseInt(val.total_count);
                }
            } else {
                this._data = val;
            }
        }

        get data() {
            return this._data;
        }

        setResult(data) {
            console.log("data=", data);
            if (isObject(data)) {
                if (data.hasOwnProperty('error')) {
                    this._error = data.error;
                } else if (data.hasOwnProperty('result')){
                    this.data = data.result;
                } else {
                    this._error = {
                        code : 1,
                        message : "Получен неожиданный ответ от сервера: не содержит ожидаемый атрибут"
                    };
                }
            } else {
                this._error = {
                    code : 2,
                    message : "Получен неожиданный ответ от сервера: не является объектом"
                };
            }
        }

        async update(onDone) {
            this._error = null;
            this._result = null;

            let options = {
                prefixUrl: prefixUrl,
                mode: 'no-cors',
                throwHttpErrors : true,
                searchParams: searchParams,
            };
            if (this.params) {
                options.method = 'post';
                options.json = this.params;
            }

            try {
                beforeUpdate();
                let result = await ky(this.uri, options).json();
                console.log("result=", result);
                this.setResult(result);
    
            } catch (e) {
                console.log("e=", e);
                this._error = {
                    message : e.message,
                    code : e.code,
                }
    
            } finally {
                afterUpdate();
                if (isFunction(onDone)) onDone(this);
            }
    
        }

        _deepCopy(val) {
            if (isArray(val)) {
                return val.map(e => (
                    this._deepCopy(e)
                ))
            } else if (isObject(val)) {
                let obj = {};
                for (let key in val) {
                    obj[key] = this._deepCopy(val[key]);
                }
                return obj;
            } else {
                return val;
            }
        }
    }
}

export default dataSourceFactory;