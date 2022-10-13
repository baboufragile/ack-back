import http from 'axios';

export class HttpRequest {

    constructor() {
        this.options = {};
    }

    /**
     * Send a GET http request
     * @param url the http URL
     * @return {Promise<any>} http response data
     */
    get = async (url) => {
        const response = await http.get(url, this.options);
        return response.data;
    }

    /**
     * Send a POST http request
     * @param url the http URL
     * @param data the body content
     * @return {Promise<any>} http response data
     */
    post = async (url, data) => {
        const response = await http.post(url, data, this.options);
        return response.data;
    }

    /**
     * Send a PUT http request
     * @param url the http URL
     * @param data the body content
     * @return {Promise<any>} http response data
     */
    put = async (url, data) => {
        const response = await http.put(url, data, this.options);
        return response.data;
    }
}