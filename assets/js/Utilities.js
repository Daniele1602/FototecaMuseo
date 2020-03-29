/**
 * Object that has useful properties and methods
 */

let Utilities = {
    /**
     * Object that allows to store data for future uses
     */
    Buffer: function () {
        let buffer = [];
        let limit = 512;
        return {
            /**
             * Function that accepts a variable number of elements
             * and puts them in the buffer
             * @param  {...any} elements 
             */
            Push: function (...elements) {
                if (buffer.length < limit) {
                    elements.forEach(element => {
                        buffer.push(element);
                    });
                }
            },

            /**
             * Function that, given a function that returns a
             * boolean expression, return the first object
             * that match the expression
             * @param {Function} expression The function with
             * returns the boolean expression for the match
             */
            Find: function (expression) {
                return buffer.find(expression);
            },

            /**
             * Function that returns the number of elements in the buffer
             */
            get Length() {
                return buffer.length;
            },

            /**
             * Return all the data stored in the Buffer
             * 
             * @param {Boolean} empty Want to remove all elements from the buffer?
             */
            Data: function (empty) {
                let data = [];
                let length = this.Length
                for (let i = 0; i < length; i++) {
                    let item;
                    if (empty) {
                        item = buffer.pop();
                    }
                    else {
                        item = buffer[i];
                    }
                    data.push(item);
                }
                return data;
            },
        }
    },

    /**
     * Object that has methods useful for Ajax operations
     */
    Ajax: {
        /**
         * @param {string} url The url with which will be executed the Ajax operation
         * @param {function} callback The callback function that will be executed when the
         * Ajax operation is completed. By default prints in the console the data.
         */
        ExecuteAjax: function (url, callback = Defaults.Callback) {
            $.ajax({
                url: url,
            }).then((data) => {
                callback(data)
            });
        }
    },
}

/**
 * Object with default values for parameters, common elements, etc.
 */
let Defaults = {

    /**
     * Default function for functions that needs a callback
     */
    Callback: function () {
        console.log(arguments);
    },

    /**
     * Url for retrieving data
     */
    get BaseInfoURL() {
        return "http://daas.marconirovereto.it:8080/";
    },

    /**
     * Url for retrieving images depending on album
     */
    get BaseImgURL() {
        return "http://daas.marconirovereto.it/img/album/";
    },
}