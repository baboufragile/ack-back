import {JwtHelper} from "JwtHelper.js";
import {HttpRequest} from "HttpRequest.js";
import fs from 'fs';
import jsrsasign from 'jsrsasign';
import EnvService from "./EnvService.js";
import {UM} from "Constant.js";
import jwt from "jsonwebtoken";
import path from "path";
import {fileURLToPath} from 'url';
import Logger from "Logger.js";

const logger = Logger.getLogger('src/application/connector/UserManagerService.js');


export default class UserManagerService {

    /**
     * Validate token from UM
     * @param token the token to validate
     * @return {Promise<boolean>} true if token is valid, false if not
     */
    static validateToken = async (token,umUrl) => {
        try {
            const url = `${this.#getUmBackend(umUrl)}/token/validate`;
            const data = {
                "tokenType": "jwt",
                "token": token,
                "token.class": "String"
            };
            const response = await new HttpRequest().put(url, data);
            return !!response.result;
        } catch (error) {
            logger.error(error);
            return false;
        }

    }

    /**
     * Get user information from UM
     * @param token the token as principal
     * @param isDelivery
     * @param umUrl
     * @return {Promise<*>} user information with binary attachments
     */
    static getUser = async (token,umUrl) => {
        const payload = JwtHelper.decode(token);
        const login = payload.sub.split('\\')[1];

        const url = `${this.#getUmBackend(umUrl)}/organization/user/${login}?attachment.binaryAttached=true`;
        return await this.#fillTokenToHeaders(new HttpRequest(), token).get(url);
    }

    // /**
    //  * check if operator property is available in actual version
    //  * @param token
    //  * @return {Promise<boolean|*>}
    //  */
    // static #operatorAvailable = async (token) => {
    //     try {
    //         const response = await this.#fillTokenToHeaders(new HttpRequest(), token).get(`${this.#getUmBackend()}/supports/OPERATOR_USER`);
    //         return response.result;
    //     } catch (e) {
    //         return false;
    //     }
    // }

    // /**
    //  * Format users information with key values
    //  * @param approveProfile
    //  * @param token
    //  * @return {Promise<{}>}
    //  */
    // static #formatUsersForSteps = async (approveProfile, token) => {
    //     let approversObject = {};
    //     const url = '/organization/appointments?';
    //
    //     if(Array.isArray(approveProfile.approvers)){
    //         await Promise.all(approveProfile.approvers.filter(item => item != 'undefined').map(async (item) => {
    //                 const approver = item ? `filter.andFilters.0.profileNamePattern=${item}&` : '';
    //                 const filter = `${approver}filter.class=com.itesoft.usermanager.client.AppointmentFilter&attachment.userAttached=true&filter.andFilters.0.class=com.itesoft.usermanager.client.ProfileFilter`;
    //                 const inactiveUsers = '&filter.notFilters.0.class=com.itesoft.usermanager.client.UserFilter&filter.notFilters.0.userState=INACTIVE';
    //                 approversObject[item] = await this.#fillTokenToHeaders(new HttpRequest(), token).get(`${this.#getUmBackend()}${url + filter + inactiveUsers}`);
    //             }
    //         ));
    //     } else {
    //         const approver = approveProfile.approvers ? `filter.andFilters.0.profileNamePattern=${approveProfile.approvers}&` : '';
    //         const filter = `${approver}filter.class=com.itesoft.usermanager.client.AppointmentFilter&attachment.userAttached=true&filter.andFilters.0.class=com.itesoft.usermanager.client.ProfileFilter`;
    //         const inactiveUsers = '&filter.notFilters.0.class=com.itesoft.usermanager.client.UserFilter&filter.notFilters.0.userState=INACTIVE';
    //         approversObject[approveProfile.approvers] = await this.#fillTokenToHeaders(new HttpRequest(), token).get(`${this.#getUmBackend()}${url + filter + inactiveUsers}`);
    //     }
    //
    //     return approversObject;
    // }

    // /**
    //  * Get users information from UM to use it in route endpoint
    //  * @param token the token as principal
    //  * @param approveProfile
    //  * @return {Promise<*>} user information with binary attachments
    //  */
    // static getUsersInformation = async (token, approveProfile) => {
    //     //operator is available or not depends on version
    //     const operatorAvailable = this.#operatorAvailable(token);
    //     if (!operatorAvailable) {
    //         process.env['ITESOFT_OPERATOR'] = operatorAvailable.toString();
    //     }
    //     return this.#formatUsersForSteps(approveProfile, token);
    // }

    // /**
    //  * Get user permissions from UM
    //  * @param token the token as principal
    //  * @return {Promise<*>} user permissions with descending hierarchy
    //  */
    // static getUserPermissions = async (token) => {
    //
    //     const url = `${this.#getUmBackend()}/permissionNames/${UM.PRODUCT_NAME}?includeDescendingHierarchy=true`;
    //     return await this.#fillTokenToHeaders(new HttpRequest(), token).get(url);
    // }

    // /**
    //  * Get unit definition
    //  * @param token the token as principal. Be careful, this principal must be an UM admin
    //  * @param type  the definition name
    //  * @return {Promise<*>} unit definition
    //  */
    // static getUnitDefinition = async (token, type) => {
    //
    //     const url = `${this.#getUmBackend()}/definitions/units?filter.unitDefinitionNamePattern=${type}`;
    //
    //     const definitions = await this.#fillTokenToHeaders(new HttpRequest(), token).get(url);
    //     if (definitions && definitions.length === 1) {
    //         return definitions[0];
    //     }
    //     throw new Error('Unable to get unique unit definition for type [' + type + ']');
    // }

    // /**
    //  * Get all units for the given definition
    //  * @param token token as principal. Be careful, this principal must be an UM admin
    //  * @param definitionId the definition id to filter (optional)
    //  * @return {Promise<*>} list of units matching with filter
    //  */
    // static getUnits = async (token, definitionId) => {
    //     let url = `${this.#getUmBackend()}/organization/units`;
    //     if (definitionId) {
    //         url += '?filter.unitDefinitionId=' + definitionId;
    //     }
    //     return await this.#fillTokenToHeaders(new HttpRequest(), token).get(url);
    // }

    /**
     * Challenge a new technical agent using public/private keys
     * @param tenant the tenant to connect
     * @param isDelivery
     * @param umUrl
     * @return {Promise<*>} jwt token
     */
    static retrieveTechnicalAgentToken = async (tenant,umUrl) => {
        const randomChallengeUrl = `${this.#getUmBackend(umUrl)}/authentication/randomChallenge`;
        const randomChallengeResponseUrl = `${this.#getUmBackend(umUrl)}/authentication/challengeResponse`;

        let randomChallengeBody = {
            "technicalAgentIdentifier": {
                "name": UM.TECHNICAL_AGENT,
                "tenantIdentifier": {
                    "name": tenant
                }
            },
            "publicKeyDefinitionIdentifier": {
                "name": UM.PUBLIC_KEY,
                "tenantIdentifier": {
                    "name": tenant
                }
            }
        };

        const request = new HttpRequest();
        const challengeResponse = await request.post(randomChallengeUrl, randomChallengeBody);
        const challenge = challengeResponse.result;
        // dirname
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const privateKeyData = fs.readFileSync(path.resolve(__dirname, this.#getPrivateKey()));
        const sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withDSA'});
        const keyObj = jsrsasign.KEYUTIL.getKey(privateKeyData.toString());

        sig.init(keyObj);

        sig.updateHex(Buffer.from(challenge, 'base64').toString('hex'));
        const response = Buffer.from(sig.sign(), 'hex');

        randomChallengeBody.response = response.toString('base64');
        const principal = await request.post(randomChallengeResponseUrl, randomChallengeBody);

        const encodeTokenUrl = this.#getUmBackend(umUrl) + '/token/encode';
        const token = await request.post(encodeTokenUrl, {
            principalToBeEncoded: principal,
            tokenType: 'jwt'
        });

        return token.result;
    }

    /**
     * Get UM backend URL
     * @return {string} UM URL
     * @private
     */
    static getUmBackend = (umUrl) => {
        return EnvService.get('UM_URL', umUrl);
    }

    /**
     * Fill token to request headers
     * Use Bearer token as authentication
     * @param request the request
     * @param token the token as principal
     * @return {*} the request filled with authorization header
     * @private
     */
    static #fillTokenToHeaders = (request, token) => {
        if (!request.options.headers) {
            request.options.headers = {};
        }
        request.options.headers['Authorization'] = 'Bearer ' + token;
        return request;
    }

    /**
     * Get private key path for technical agent challenge
     * @return {string} path to the private key
     * @private
     */
    static #getPrivateKey = () => {
        return '../../../env/keys/' + EnvService.get('TENANT', 'ACME') + '/key.pem';
    }

    /**
     * Verify JWT Signature
     * @param token
     * @return {*} the payload of the JWT token
     */
    static verifyToken = (token) => {
        return JwtHelper.verify(token)
    }

}
