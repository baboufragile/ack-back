import Client from 'ssh2-sftp-client';
import fs from "fs";

let sftp = new Client();

export async function sendWithSsh(host,user,password,timestamp,isDelivery,remoteFile){
    const localPath = "/ack/"+timestamp+".ack";
    if (isDelivery){
        sftp.connect({
            host: host,
            port: '22',
            username: user,
            privateKey: fs.readFileSync('/delivery/delivery.ppk')
        }).then((data) => {
            console.log(data, 'the data info');
            sftp.fastPut(localPath, remoteFile);
            return sftp.list('/pathname');
        }).catch(err => {
            console.log(err, 'catch error');
        });
    }else{
        sftp.connect({
            host: host,
            port: '22',
            username: user,
            password: password
        }).then((data) => {
            console.log(data, 'the data info');
            return sftp.list('/pathname');
        }).catch(err => {
            console.log(err, 'catch error');
        });
    }
}




// import ftp from "basic-ftp";
// // ESM: import * as ftp from "basic-ftp"
//
// example()
//
// async function example(host,user,password,timestamp,isDelivery) {
//
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//             host: host,
//             user: user,
//             password: password,
//             secure: true
//         })
//         console.log(await client.list())
//         await client.uploadFrom(localPath, "README_FTP.md")
//         await client.downloadTo("README_COPY.md", "README_FTP.md")
//     }
//     catch(err) {
//         console.log(err)
//     }
//     client.close()
// }