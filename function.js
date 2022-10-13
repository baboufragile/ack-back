import fs from "fs";

import builder from 'xmlbuilder';
import {sendWithSsh} from "./ftp";
import UserManagerService from "./GetUmToken.js";
import axios from "axios";


export function XmlCreator(code, messageReturn, myJson){
    let xml = builder.create('root')
        .ele('id', myJson.header.invoiceId ).up()
        .ele('contentData')
        .ele('header')
        .ele('returnCode',code).up()
        .ele('returnMessage',messageReturn).up().up().up()
        .ele('invoice','<![CDATA['+ JSON.stringify(myJson) +']]>')
        .end({pretty: true});
    return xml
}

export const makeFile=(request,reply)=>{
    const {code, messageReturn,umAddress,isDelivery,vmAddress,invoiceId,portTokenProvider,password,remotePath} = request.body
    try{
        const timestamp = new Date().getTime();
        const json = getInvoiceJson(isDelivery,umAddress,vmAddress,invoiceId,portTokenProvider)
        fs.writeFileSync("ack/"+timestamp+".xml", XmlCreator(code, messageReturn, json))
        sendWithSsh(vmAddress,password,timestamp,isDelivery,remotePath).then(

        )
        reply.send(true)
    }catch (e){
        console.log("Error makeFile",e)
        reply.send(false)
    }
}

export async function getInvoiceJson(isDelivery,umAddress,vmAddress,invoiceId,portTokenProvider){
    if (isDelivery){
        umAddress = umAddress+":7802"
    }else {
        umAddress = umAddress+":"+portTokenProvider
    }

    let barerToken = await UserManagerService.retrieveTechnicalAgentToken("ACME", umAddress)
    let json

    json = await axios.get("https://"+vmAddress+"/back/api/rest/invoices/"+invoiceId,{ headers: { "Authorization" : barerToken } })

    return json
}