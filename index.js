
const http = require('http');
const url = require('url');
const fs = require('fs');

//blocking syncronous way 

// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut =  ` this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/Output.txt',textOut);
// console.log("file writen!!");

//non blocking asyncronous way 

// fs.readFile('./txt/startxxx.txt','utf-8',(err,data1)=> {
//     if (err) return console.log('error !!!!!!!!!');
    
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=> {
//         fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=> {
//             fs.readFile('./txt/append.txt','utf-8',(err,data3)=> {
//                 console.log(data3);
                
//                 fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err =>{
//                     console.log('your file has been writen');
                    
//                 });
//             });
        
//     });
        
//     });
    
// });
// console.log('Will read file ');




//server

const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCTIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
    //Output = Output.replace(/{%IAMGE%}/g, product.productImage);
}

const data =  fs.readFileSync( `${__dirname}/dev-data/data.json`,'utf-8');
const tempOver =  fs.readFileSync( `${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard =  fs.readFileSync( `${__dirname}/templates/template-card.html`,'utf-8');
const tempProd =  fs.readFileSync( `${__dirname}/templates/template-product.html`,'utf-8');
const dataObj =  JSON.parse(data);

const server  = http.createServer((req,res) => {
    //console.log(req.url);
    const {query,pathname} = (url.parse(req.url,true));
    //const pathname = req.url;
    
    
    
//overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'content-type':'text/html'});
        //res.end(tempOver);
        const cardsHtml = dataObj.map( el => replaceTemplate(tempCard,el)).join('');
        const output = tempOver.replace('{%CARDS%}',cardsHtml);
        console.log(cardsHtml);
        res
        .end(output);

        //product page 
    } else if ( pathname === '/product'){
        res.writeHead(200,{'content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProd,product);
        console.log(query);
        
        res.end(output);

        //api 
    } else if ( pathname === '/api'){
        res.writeHead(200,{'content-type':'application/json'});
        res.end(data);

        //not found 
    } else {
        res.writeHead(404,{
            'content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1> page not found </h1>')
    }

});

server.listen(3000, '127.0.0.1', () => {
    console.log('listening for requests on port 3000');
    
})