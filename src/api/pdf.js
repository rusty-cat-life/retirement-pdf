const puppeteer = require('puppeteer')
const moment = require('moment')
const logger = require('../../logger.js')

const validate = p => {
  return (
    p.companyName.length &&
    p.president.length &&
    p.division.length &&
    p.name.length &&
    Number.isInteger(+p.year) &&
    Number.isInteger(+p.month) &&
    Number.isInteger(+p.day)
  )
}

const createHtml = param => {
  const { companyName, president, division, name, year, month, day } = param

  // pdf生成時の日付
  const _year = moment().format('YYYY')
  const _month = moment().format('MM')
  const _day = moment().format('DD')
  return `
<html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Sawarabi+Gothic" rel="stylesheet">
        <style>
            body {
                margin: 0;
                padding: 20mm;
                font-family: "Sawarabi Gothic", "游明朝", YuMincho, "ヒラギノ明朝 ProN W3", "Hiragino Mincho ProN", "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
                font-size: 20px;
            }

            .title {
                padding-top: 20mm;
                font-size: 48px;
            }

            .date {
                padding: 10mm 0;
                text-align: right; 
            }

            .left {
                text-align: left;
            }

            .right {
                text-align: right;
            }

            .center {
                text-align: center;
            }

            .blank {
                height: 10mm;
            }
        </style>
    </head>
    <body>
        <div class='title center'>
            退職届
        </div>
        <div class='date'>西暦${_year}年${_month}月${_day}日</div>
        <div class='left'>
            <p>${companyName}</p>
            <p>代表取締役　${president}　殿</p>
        </div>
        <div class='right'>
            <p>${division}</p>
            <p>${name}　㊞</p>
            <p class='blank' />
            <p>私事、</p>
        </div>
        <div class='left'>
            <p>このたび一身上の都合により、</p>
            <p>来たる西暦${year}年${month}月${day}日をもって退職致します。</p>
        </div>
        <div class='right'>
            以上
        </div>
    </body>
</html>
`
}

const option = {
  format: 'A4'
}

const createPdf = async (req, res) => {
  const param = req.query

  if (!validate(param)) {
    res.status(400).send('Invalid Arguments')
    return
  }

  const date = moment().format('YYYY_MM_DD')
  const filename = `notice_of_retirement_${date}.pdf`

  try{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.setContent(createHtml(param), { waitUntil: 'load' })
  
    const pdf = await page.pdf({ format: 'A4' })
  
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment;filename=' + filename,
      'Content-Length': pdf.length
    })
    
    res.end(pdf)

    await browser.close()
  } catch(err) {
      logger.error(err)
      res.status(500).send('Internal Server Error')
  }
}

module.exports = createPdf
