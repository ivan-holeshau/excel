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
            console.log(`Парсинг прошёл успешно строка ${stroka}`);
            resolve(data);
        }
    });
}

// parseURL('www.sima-land.ru/1182280/fayl-vkladysh-a4-byurokrat-ekonom-23-mkm-prozrachnyy-vertikalnyy-glyancevyy-100-shtuk/')
// .then(data => {
//     console.log(data)
// })

module.exports.parseURL = parseURL

// function validLink() {
//     let validLink = "www.sima-land.ru/1182280/fayl-vkladysh-a4-byurokrat-ekonom-23-mkm-prozrachnyy-vertikalnyy-glyancevyy-100-shtuk/"
//     validLink = validLink.toLowerCase()
//     const siteName = "sima-land.ru"
  
//     if (validLink.includes(siteName)) {
//       const countRemoveSymbl = validLink.indexOf(siteName) + siteName.length
//       const validLinkArr = validLink.split('')
//       validLinkArr.splice(0, countRemoveSymbl, "https://www.sima-land.ru")
//       validLink = validLinkArr.join('')
//       return validLink
//     } else {
//         return false
//     }
//   }
//   console.log(validLink()) 

// let arr1 = '123'
// let arr2 = arr1

// arr2 + '4'

// console.log(arr1, arr2)