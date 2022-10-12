import fs from "fs";

import builder from 'xmlbuilder';
import {sendWithSsh} from "./ftp";

export function XmlCreator(mySecondVar, myThirdVar, myJson){
    let xml = builder.create('root')
        .ele('id', myJson.header.invoiceId ).up()
        .ele('contentData')
        .ele('header')
        .ele('returnCode',mySecondVar).up()
        .ele('returnMessage',myThirdVar).up().up().up()
        .ele('invoice','<![CDATA['+ JSON.stringify(myJson) +']]>')
        .end({pretty: true});
    return xml
}

export const makeFile=(request,reply)=>{
    const {mySecondVar, myThirdVar, myJson,host,} = request.body
    try{
        fs.writeFileSync("ack/test.xml", XmlCreator(mySecondVar, myThirdVar, myJson))
        sendWithSsh()
        reply.send(true)
    }catch (e){
        console.log("Error makeFile",e)
        reply.send(false)
    }
}