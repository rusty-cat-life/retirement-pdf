const moment = require('moment')
const logger = require('../../logger.js')
const wkhtmltopdf = require('wkhtmltopdf')

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
        <style>
            body {
                margin: 0;
                padding: 20mm;
                font-family: "Aozora Mincho Light";
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

const createPdf = async (req, res) => {
  const param = req.query

  if (!validate(param)) {
    res.status(400).send('Invalid Arguments')
    return
  }

  const date = moment().format('YYYY_MM_DD')
  const filename = `notice_of_retirement_${date}.pdf`

  try {
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment;filename=' + filename
    })

    wkhtmltopdf(createHtml(param)).pipe(
      res,
      { end: true }
    )
  } catch (e) {
    logger.error(e)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = createPdf
