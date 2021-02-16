import log4js from 'log4js';
import aws from 'aws-sdk';

const logger = log4js.getLogger('UserResolver');

const getDataUpdate = (oldData, newData) => {
  let msg = `
    <table style="height: 68px;" width="689">
      <thead>
        <tr>
          <td style="width: 150px; height: 18px;"><strong>Property</strong></td>
          <td style="width: 260px; height: 18px;"><strong>OldValue</strong></td>
          <td style="width: 260px; height: 18px;"><strong>NewValue</strong></td>
        </tr>
      </thead>
      <tbody>`;
  for (const [key, value] of Object.entries(newData)) {
    msg += `<tr>
        <td style="width: 150px; height: 18px;">${key}</td>
        <td style="width: 260px; height: 18px;">${oldData[key]}</td>
        <td style="width: 260px; height: 18px;">${value}</td>
      </tr>`;
  }
  msg += `</tbody>
  </table>`;
  return msg;
};

class NotificationHandler {
  sentProductNotification(users, oldData, newData) {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });
    this.ses = new aws.SES({ apiVersion: '2010-12-01' });
    const table = getDataUpdate(oldData, newData);
    users.map(async user => {
      const messageData = `<html>
          <body>
            <h1>Dear admin ${user.name}!</h1>
            <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p>
            <h3>The product was udpate with the next detail:</h3>
            ${table}
            <p><strong>&nbsp;</strong></p>
            <p><strong>Regards</strong></p>
            <p><strong>Backend Technical test</strong></p>
            <p><strong>&nbsp;</strong></p>
          </body>
        </html>`;
      const params = {
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: messageData,
            },
            Text: {
              Charset: 'UTF-8',
              Data: 'Review the details in the main page.',
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'The product was update.',
          },
        },
        Source: process.env.AWS_SENDER_EMAIL,
      };
      try {
        await this.ses.sendEmail(params).promise();
        logger.info(`The email was sended to ${user.email}`);
      } catch (ex) {
        logger.warn('Notification error: ', ex.message);
      }
    });
  }
}

const handler = new NotificationHandler();
export default handler;
