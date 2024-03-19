import { Injectable } from '@nestjs/common'
const nodemailer = require('nodemailer')

@Injectable()
export class MailService {
	private transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'mail.hosting.reg.ru',
			port: 465,
            // защищенный 465, host mail.hosting.reg.ru
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}
	async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активация аккаунта на ' + process.env.API_URL,
			text: '',
			html: `
                
                <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.fontstorage.com/import/bicubik.css');

        body {
            font-family: 'Bicubik', sans-serif;
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: black !important;
        }

        .center-container {
            margin: 0 auto;
            text-align: center;
            width: 600px;
        }

        a {
            font-weight: 400;
            border: 2px solid black;
            background-color: #d9d9d9;
            color: black !important;
            text-decoration: none;
            padding: 20px 90px;
            font-size: 30px;
          
        }

       
    </style>
    <title>Моя веб-страница</title>
</head>
<body>
    <div class="center-container">
        <div style="margin-top: 120px; margin-bottom: 120px;">
            <p style="font-size: 20px; font-weight: 500; margin-bottom: 160px; color: black">это команда ВИТРИМЫ! Чтобы подтвердить почту, нажмите кнопку ниже</p>
            <a href="${link}">ПОДТВЕРДИТЬ</a>
        </div>
        <div style="background-color: black; padding: 30px 15px;">
            <img style="width: 250px;" src='https://i.postimg.cc/tJF7Fc85/Full-logotype.png'/>
        </div>
    </div>
</body>
                `,
		})
	}
}
