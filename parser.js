const tress = require('tress')
const cheerio = require('cheerio')
const request = require('request')

async function parseURL(URL, stroka){
    return new Promise((resolve, reject) => {

        const data = {
            title: '',
            article: ''
        };
        const q = tress(function(url, callback){
            request(url, function (err, res) {
                if (err) throw err;
        
                var $ = cheerio.load(res.body);
        
                data.title = $('._2o31e').html()
                data.article = $('._1Mu9j.oPhjS').html().replace(/[^0-9]/g, '')
        
                callback();
            });
        });
        
        q.push(URL);
        
        q.drain = function(){
            resolve(data);
        }
    });
}

module.exports.parseURL = parseURL
